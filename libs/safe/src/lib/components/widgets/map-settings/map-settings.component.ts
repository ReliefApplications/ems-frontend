import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { createMapWidgetFormGroup } from './map-forms';
import { UntypedFormGroup } from '@angular/forms';
import {
  DefaultMapControls,
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../ui/map/interfaces/map.interface';
import { takeUntil, tap } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { LayerModel } from '../../../models/layer.model';
import { MapLayerComponent } from './map-layer/map-layer.component';
import { SafeMapLayersService } from '../../../services/map/map-layers.service';
import { SafeConfirmService } from '../../../services/confirm/confirm.service';
import { TranslateService } from '@ngx-translate/core';
import { MapComponent } from '../../ui/map';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';

/** Component for the map widget settings */
@Component({
  selector: 'safe-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
})
export class SafeMapSettingsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public currentTab: 'parameters' | 'layers' | 'layer' | 'display' | null =
    'parameters';
  public mapSettings!: MapConstructorSettings;
  public layerIds: string[] = [];
  // === REACTIVE FORM ===
  tileForm: UntypedFormGroup | undefined;

  // layerNavigationTemplate: TemplateRef<any> | null = null;
  // layerSettingsTemplate: TemplateRef<any> | null = null;

  // === WIDGET ===
  @Input() tile: any;
  public openedLayer?: LayerModel;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  @ViewChild(MapLayerComponent) layerComponent?: MapLayerComponent;
  @ViewChild(MapComponent) mapComponent?: MapComponent;

  /**
   * Class constructor
   *
   * @param mapLayersService SafeMapLayersService to add/edit/remove layers
   * @param confirmService SafeConfirmService
   * @param translate TranslateService
   * @param cdr ChangeDetectorRef
   */
  constructor(
    private mapLayersService: SafeMapLayersService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.tileForm = extendWidgetForm(
      createMapWidgetFormGroup(this.tile.id, this.tile.settings),
      this.tile.settings?.widgetDisplay
    );
    this.layerIds = this.tileForm.get('layers')?.value;

    this.change.emit(this.tileForm);

    const defaultMapSettings: MapConstructorSettings = {
      basemap: this.tileForm.value.basemap,
      initialState: this.tileForm.get('initialState')?.value,
      controls: this.tileForm.value.controls,
      arcGisWebMap: this.tileForm.value.arcGisWebMap,
      layers: this.tileForm.value.layers,
    };
    this.updateMapSettings(defaultMapSettings);
    this.setUpFormListeners();
  }

  /**
   * Set form listeners
   */
  private setUpFormListeners() {
    if (!this.tileForm) return;

    this.tileForm?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.change.emit(this.tileForm);
    });
    this.tileForm
      .get('initialState')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          initialState: value,
        } as MapConstructorSettings)
      );
    this.tileForm
      .get('basemap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({ basemap: value } as MapConstructorSettings)
      );
    this.tileForm
      .get('controls')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateMapSettings({
          controls: value,
        } as MapConstructorSettings);
      });
    this.tileForm
      .get('arcGisWebMap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          arcGisWebMap: value,
        } as MapConstructorSettings)
      );
    this.tileForm
      .get('layers')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((layerIds) => {
        this.layerIds = layerIds;
      });
  }

  /**
   * Set tab an initialize map properties if needed
   *
   * @param tab Tab
   */
  private openTab(tab: 'parameters' | 'layers' | 'layer' | 'display' | null) {
    // Reset settings when switching to/from 'layer' tab
    if (
      (this.currentTab === 'layer' && tab !== 'layer') ||
      (this.currentTab !== 'layer' && tab === 'layer')
    ) {
      this.mapSettings = {
        basemap: this.tileForm?.value.basemap,
        initialState: this.tileForm?.get('initialState')?.value,
        controls:
          tab !== 'layer' ? this.tileForm?.value.controls : DefaultMapControls,
        arcGisWebMap: this.tileForm?.value.arcGisWebMap,
        ...(tab !== 'layer' && {
          layers: this.tileForm?.value.layers,
        }),
      };
    }
    this.currentTab = tab;
    this.cdr.detectChanges();
  }

  /**
   * Handle tab set logic
   *
   * @param selectedTab tab
   */
  handleTabChange(
    selectedTab: 'parameters' | 'layers' | 'layer' | 'display' | null
  ) {
    if (this.currentTab === 'layer' && !this.layerComponent?.form.pristine) {
      const confirmDialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.close'),
        content: this.translate.instant(
          'components.widget.settings.close.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmColor: 'warn',
      });
      confirmDialogRef.afterClosed().subscribe((value: any) => {
        if (value) {
          this.openTab(selectedTab);
        }
      });
    } else {
      this.openTab(selectedTab);
    }
  }

  /**
   * Update map settings
   *
   * @param settings new settings
   */
  private updateMapSettings(settings: MapConstructorSettings) {
    if (this.mapSettings) {
      this.mapSettings = {
        ...this.mapSettings,
        ...settings,
      };
    } else {
      this.mapSettings = settings;
    }
  }

  /**
   * Handle leaflet map events
   *
   * @param event leaflet map event
   */
  handleMapEvent(event: MapEvent) {
    if (!this.tileForm) return;
    switch (event.type) {
      case MapEventType.MOVE_END:
        this.mapSettings.initialState.viewpoint.center.latitude =
          event.content.center.lat;
        this.mapSettings.initialState.viewpoint.center.longitude =
          event.content.center.lng;
        break;
      case MapEventType.ZOOM_END:
        this.mapSettings.initialState.viewpoint.zoom = event.content.zoom;
        this.tileForm
          .get('initialState.viewpoint.zoom')
          ?.setValue(this.mapSettings.initialState.viewpoint.zoom, {
            emitEvent: false,
          });
        break;
      default:
        break;
    }
  }

  /**
   * Open layer edition
   *
   * @param layer layer to open
   */
  onEditLayer(layer?: LayerModel): void {
    this.openedLayer = layer;
    // We initialize the map settings to default value once we display the map layer editor
    (this.mapComponent as MapComponent).mapSettings = {
      basemap: 'OSM',
      initialState: {
        viewpoint: {
          center: {
            longitude: 0,
            latitude: 0,
          },
          zoom: 2,
        },
      },
      controls: DefaultMapControls,
    };
    this.openTab('layer');
  }

  /**
   * Delete given layer id from the layers form and updates map view
   *
   * @param layerIdToDelete Layer id to  delete
   */
  onDeleteLayer(layerIdToDelete: string): void {
    // Update layer form
    this.updateLayersForm(layerIdToDelete, true);
    // Update map view
    this.mapSettings = {
      basemap: this.tileForm?.value.basemap,
      initialState: this.tileForm?.get('initialState')?.value,
      controls: this.tileForm?.value.controls,
      arcGisWebMap: this.tileForm?.value.arcGisWebMap,
      layers: this.tileForm?.value.layers,
    };
  }

  /**
   * Add or edit existing layer
   *
   * @param layerData layer to save
   */
  saveLayer(layerData?: any) {
    if (layerData) {
      if (layerData.id) {
        this.mapLayersService.editLayer(layerData).subscribe({
          next: (result) => {
            // We check if we are editing an already added layer to the tile form
            // Or we are adding a new one from an existing layer
            if (
              result &&
              !this.tileForm?.get('layers')?.value.includes(result.id)
            ) {
              this.updateLayersForm(result.id);
            }
            // Redirect to main layers list
            this.openTab('layers');
          },
          error: (err) => console.log(err),
        });
      } else {
        this.mapLayersService
          .addLayer(layerData)
          .pipe(
            tap((result) => {
              // Update our current layer list after the new one is added
              if (result) {
                this.mapLayersService.currentLayers.push(result);
              }
            })
          )
          .subscribe({
            next: (result) => {
              if (result) {
                this.updateLayersForm(result.id);
              }
              // Redirect to main layers list
              this.openTab('layers');
            },
            error: (err) => console.log(err),
          });
      }
    } else {
      // Redirect to main layers list
      this.openTab('layers');
    }
  }

  /**
   * Add given layer id to the layers form
   *
   * @param newLayerId New layer to set in the layers form
   * @param toDelete Is to delete or not
   */
  private updateLayersForm(newLayerId: string, toDelete = false) {
    let layers = [...(this.tileForm?.get('layers')?.value ?? []), newLayerId];
    if (toDelete) {
      layers = this.tileForm
        ?.get('layers')
        ?.value.filter((layerId: string) => layerId !== newLayerId);
    }
    this.tileForm?.get('layers')?.setValue(layers);
    this.tileForm?.markAsTouched();
    this.tileForm?.markAsDirty();
  }
}
