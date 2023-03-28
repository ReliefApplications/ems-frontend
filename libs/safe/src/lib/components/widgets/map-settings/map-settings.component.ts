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
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { Layer } from '../../../models/layer.model';
import { MapLayerComponent } from './map-layer/map-layer.component';
import { SafeMapLayersService } from '../../../services/map/map-layers.service';
import { SafeConfirmService } from '../../../services/confirm/confirm.service';
import { TranslateService } from '@ngx-translate/core';
import { MapComponent } from '../../ui/map';

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
  public currentTab: 'parameters' | 'layers' | 'layer' | null = 'parameters';
  public mapSettings!: MapConstructorSettings;

  // === REACTIVE FORM ===
  tileForm: UntypedFormGroup | undefined;

  // layerNavigationTemplate: TemplateRef<any> | null = null;
  // layerSettingsTemplate: TemplateRef<any> | null = null;

  // === WIDGET ===
  @Input() tile: any;
  public openedLayer?: Layer;

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
    this.tileForm = createMapWidgetFormGroup(this.tile.id, this.tile.settings);
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
  }

  /**
   * Set tab an initialize map properties if needed
   *
   * @param tab Tab
   */
  private openTab(tab: 'parameters' | 'layers' | 'layer' | null) {
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
  handleTabChange(selectedTab: 'parameters' | 'layers' | 'layer' | null) {
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
  onEditLayer(layer?: Layer): void {
    this.openedLayer = layer;
    // We initialize the map settings to default value once we display the map layer editor
    (this.mapComponent as MapComponent).settingsConfig = {
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
      arcGisWebMap: 'a8c3c531be1a4615b03c45b6353ab2c8',
    };
    this.openTab('layer');
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
          next: () => {
            // Redirect to main layers list
            this.openTab('layers');
          },
          error: (err) => console.log(err),
        });
      } else {
        this.mapLayersService.addLayer(layerData).subscribe({
          next: (result) => {
            if (result) {
              this.tileForm?.get('layers')?.value.push(result.id);
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
}
