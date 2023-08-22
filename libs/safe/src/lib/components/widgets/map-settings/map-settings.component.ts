import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef,
  ViewContainerRef,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { createMapWidgetFormGroup } from './map-forms';
import { UntypedFormGroup } from '@angular/forms';
import {
  DefaultMapControls,
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../ui/map/interfaces/map.interface';
import { BehaviorSubject, Subject, debounceTime, takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { LayerModel } from '../../../models/layer.model';
import { MapComponent } from '../../ui/map';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { SafeLayoutService } from '../../../services/layout/layout.service';

/** Component for the map widget settings */
@Component({
  selector: 'safe-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
})
export class SafeMapSettingsComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  public currentTab: 'parameters' | 'layers' | 'layer' | 'display' | null =
    'parameters';
  public mapSettings!: MapConstructorSettings;
  // === REACTIVE FORM ===
  tileForm!: UntypedFormGroup;

  // === WIDGET ===
  @Input() tile: any;
  public openedLayers: (LayerModel | undefined)[] = [];

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
  public mapComponent?: MapComponent;
  @ViewChild('mapContainer', { read: ViewContainerRef })
  mapContainerRef!: ViewContainerRef;

  public currentMapContainerRef = new BehaviorSubject<ViewContainerRef | null>(
    null
  );
  destroyTab$: Subject<boolean> = new Subject<boolean>();

  // Layers controls right side nav. Store if sidenav is used, to be able to destroy it when closing the view.
  private openedLayersSideNav = false;

  /**
   * Class constructor
   *
   * @param cdr ChangeDetectorRef
   * @param layoutService Shared layout service
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private layoutService: SafeLayoutService
  ) {
    super();
  }

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.tileForm = extendWidgetForm(
      createMapWidgetFormGroup(this.tile.id, this.tile.settings),
      this.tile.settings?.widgetDisplay
    );

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

  ngAfterViewInit(): void {
    const componentRef = this.mapContainerRef.createComponent(MapComponent);
    componentRef.instance.mapSettings = this.mapSettings;
    componentRef.instance.mapEvent
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => this.handleMapEvent(event));
    this.mapComponent = componentRef.instance;
    this.currentMapContainerRef.next(this.mapContainerRef);

    this.layoutService.rightSidenav$
      .pipe(takeUntil(this.destroy$))
      .subscribe((view: any) => {
        if (view?.inputs?.layersMenuExpanded) {
          this.openedLayersSideNav = true;
        }
      });
  }

  /**
   * Change on selected index.
   */
  selectedIndexChange(): void {
    this.destroyTab$.next(true);
    const currentContainerRef = this.currentMapContainerRef.getValue();
    if (currentContainerRef) {
      const view = currentContainerRef.detach();
      if (view) {
        this.mapContainerRef.insert(view);
        this.currentMapContainerRef.next(this.mapContainerRef);
        this.destroyTab$.next(false);
      }
    }
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
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          initialState: value,
        } as MapConstructorSettings)
      );
    this.tileForm
      .get('basemap')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({ basemap: value } as MapConstructorSettings)
      );
    this.tileForm
      .get('controls')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateMapSettings({
          controls: value,
        } as MapConstructorSettings);
      });
    this.tileForm
      .get('arcGisWebMap')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          arcGisWebMap: value,
        } as MapConstructorSettings)
      );
    this.tileForm
      .get('layers')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          layers: value,
        } as MapConstructorSettings)
      );
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
    if (this.mapComponent) {
      this.mapComponent.mapSettings = this.mapSettings;
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

  // /**
  //  * Open layer edition
  //  *
  //  * @param layer layer to open
  //  */
  // onEditLayer(layer?: LayerModel): void {
  //   // this.openedLayers.unshift(layer);
  //   // We initialize the map settings to default value once we display the map layer editor
  //   (this.mapComponent as MapComponent).mapSettings = {
  //     basemap: 'OSM',
  //     initialState: {
  //       viewpoint: {
  //         center: {
  //           longitude: 0,
  //           latitude: 0,
  //         },
  //         zoom: 2,
  //       },
  //     },
  //     controls: DefaultMapControls,
  //   };
  //   // this.openTab('layer');
  // }

  // /**
  //  * Delete given layer id from the layers form and updates map view
  //  *
  //  * @param layerIdToDelete Layer id to  delete
  //  */
  // onDeleteLayer(layerIdToDelete: string): void {
  //   // Update layer form
  //   this.updateLayersForm(layerIdToDelete, true);
  //   // Update map view
  //   this.mapSettings = {
  //     basemap: this.tileForm?.value.basemap,
  //     initialState: this.tileForm?.get('initialState')?.value,
  //     controls: this.tileForm?.value.controls,
  //     arcGisWebMap: this.tileForm?.value.arcGisWebMap,
  //     layers: this.tileForm?.value.layers,
  //   };
  // }

  // /**
  //  * Add or edit existing layer
  //  *
  //  * @param layerData layer to save
  //  */
  // saveLayer(layerData?: any) {
  //   const goToNextScreen = () => {
  //     // Go to the previous layer if we are editing an existing one
  //     this.openedLayers.shift();

  //     // If no more layers to edit, go back to the main layers list
  //     if (this.openedLayers.length === 0) this.openTab('layers');
  //   };

  //   if (layerData) {
  //     if (layerData.id) {
  //       this.mapLayersService.editLayer(layerData).subscribe({
  //         next: (result) => {
  //           // We check if we are editing an already added layer to the tile form
  //           // Or we are adding a new one from an existing layer
  //           const layer = this.openedLayers[0];
  //           const isInGroup = this.openedLayers.length > 1;
  //           const layersArr = isInGroup
  //             ? layer?.sublayers ?? []
  //             : this.tileForm?.get('layers')?.value ?? [];

  //           if (result && !layersArr?.includes(result.id)) {
  //             this.updateLayersForm(result.id);
  //           }
  //           goToNextScreen();
  //         },
  //         error: (err) => console.log(err),
  //       });
  //     } else {
  //     }
  //   } else {
  //     goToNextScreen();
  //   }
  // }

  // /**
  //  * Add given layer id to the layers form
  //  *
  //  * @param newLayerId New layer to set in the layers form
  //  * @param toDelete Is to delete or not
  //  */
  // private updateLayersForm(newLayerId: string, toDelete = false) {
  //   const isGroupForm = this.openedLayers.length > 1;

  //   if (!isGroupForm) {
  //     let layers = [...(this.tileForm?.get('layers')?.value ?? []), newLayerId];
  //     if (toDelete) {
  //       layers = this.tileForm
  //         ?.get('layers')
  //         ?.value.filter((layerId: string) => layerId !== newLayerId);
  //     }
  //     this.tileForm?.get('layers')?.setValue(layers);
  //     this.tileForm?.markAsTouched();
  //     this.tileForm?.markAsDirty();
  //     return;
  //   }

  //   // This function will never be called when deleting a layer from a group
  //   if (toDelete) return;

  //   // Add to the second element, since that will be the group
  //   // containing the sublayer that was just saved.
  //   const layer = this.openedLayers[1];
  //   if (!layer) return;

  //   const currLayers = layer.sublayers ?? [];
  //   layer.sublayers = [...new Set([...currLayers, newLayerId])];
  // }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.mapContainerRef.detach();
    // Destroy layers control sidenav when closing the settings
    if (this.openedLayersSideNav) {
      this.layoutService.setRightSidenav(null);
    }
  }
}
