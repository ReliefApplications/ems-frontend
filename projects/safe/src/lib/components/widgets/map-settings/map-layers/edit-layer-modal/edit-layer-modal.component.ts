import { AfterViewInit, Component, Inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { createLayerForm } from '../../map-forms';
import { MapLayerI } from '../map-layers.component';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../../../ui/map/interfaces/map.interface';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';
import { SafeMapLayersService } from '../../../../../services/maps/map-layers.service';
import {
  LayerActionOnMap,
  OverlayLayerTree,
} from '../../../../ui/map/interfaces/map-layers.interface';

declare let L: any;

/** Layer used to test the component */
const TEST_LAYER = {
  polygon: {
    type: 'Feature',
    properties: {},
    geometry: {
      coordinates: [
        [
          [40.11348234228487, 23.758349944054757],
          [48.178129828595445, 24.533783435928683],
          [48.95401786039133, 45.045564528935415],
          [13.062267296081501, 36.89381558821758],
          [2.6529027332038595, 20.097026832317425],
          [40.11348234228487, 23.758349944054757],
        ],
      ],
      type: 'Polygon',
    },
  },
  point: {
    type: 'Feature',
    properties: {},
    geometry: {
      coordinates: [40.11348234228487, 23.758349944054757],
      type: 'Point',
    },
  },
};

/** Modal for adding and editing map layers */
@Component({
  selector: 'safe-edit-layer-modal',
  templateUrl: './edit-layer-modal.component.html',
  styleUrls: ['./edit-layer-modal.component.scss'],
})
export class SafeEditLayerModalComponent
  extends SafeUnsubscribeComponent
  implements AfterViewInit
{
  public form: UntypedFormGroup;

  private currentLayer: any;
  private layerOptions: any = {};

  /** @returns the selected layer type */
  public get layerType(): keyof typeof TEST_LAYER | null {
    return this.form.get('type')?.value;
  }
  /** @returns the selected icon with the given style config */
  private get icon(): any | null {
    return this.safeMapLayerService.createCustomDivIcon(
      this.form.get('style')?.value
    );
  }

  // === MAP ===
  public mapSettings!: MapConstructorSettings;
  private addOrDeleteLayer: BehaviorSubject<LayerActionOnMap | null> =
    new BehaviorSubject<LayerActionOnMap | null>(null);
  public layerToAddOrDelete$ = this.addOrDeleteLayer.asObservable();
  private updateLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public updateLayer$ = this.updateLayer.asObservable();

  /**
   * Modal for adding and editing map layers
   *
   * @param safeMapLayerService Service needed to create the icon for point type layer
   * @param layer Injected map layer, if any
   */
  constructor(
    private safeMapLayerService: SafeMapLayersService,
    @Inject(MAT_DIALOG_DATA) public layer?: MapLayerI
  ) {
    super();
    this.form = createLayerForm(layer);
  }

  ngAfterViewInit(): void {
    console.log(this.form);
    this.configureMapSettings();
    if (this.layerType) {
      this.setUpLayer();
    }
    this.setUpEditLayerListeners();
  }

  /**
   * Configure map settings
   */
  private configureMapSettings() {
    this.mapSettings = {
      centerLong: 0,
      centerLat: 0,
      maxBounds: L.latLngBounds(L.latLng(-90, -1000), L.latLng(90, 1000)),
      basemap: 'OSM',
      zoomControl: false,
      minZoom: 2,
      maxZoom: 18,
      zoom: 2,
      worldCopyJump: true,
    };
  }

  /**
   * Update layer options
   *
   * @param options new options
   */
  private updateLayerOptions(options?: { [key: string]: any }) {
    this.layerOptions = {
      ...this.layerOptions,
      ...(options && options),
    };
    this.updateLayer.next({
      layer: this.currentLayer,
      options: this.layerOptions,
      ...(this.layerType === 'point' && { icon: this.icon }),
    });
  }

  /**
   * Set edit layers listeners.
   */
  private setUpEditLayerListeners() {
    this.form.controls.visibilityRangeStart.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => {
        this.updateLayerOptions({
          visibilityRange: [value, this.form.controls.visibilityRangeEnd.value],
        });
      });
    this.form.controls.visibilityRangeEnd.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => {
        this.updateLayerOptions({
          visibilityRange: [
            this.form.controls.visibilityRangeStart.value,
            value,
          ],
        });
      });

    this.form.controls.opacity.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => {
        this.updateLayerOptions({ opacity: value, fillOpacity: value });
      });

    this.form.controls.name.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.updateLayerOptions({ name: value });
      });

    this.form.controls.defaultVisibility.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.updateLayerOptions({ visible: value });
      });

    // apply marker style changes
    this.form
      .get('style')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.layerType === 'point') {
          this.updateLayerOptions();
        }
      });
    this.form
      .get('type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.layerType === 'point' || this.layerType === 'polygon')
          this.setUpLayer();
      });
  }

  /**
   * Set ups the new selected layer and also removes the previous one
   */
  private setUpLayer() {
    // If a layer is already applied to the map we first delete it
    if (this.currentLayer) {
      this.addOrDeleteLayer.next({
        layerData: this.currentLayer,
        isDelete: true,
      });
    }
    if (this.layerType) {
      this.currentLayer = L.geoJSON(TEST_LAYER[this.layerType]);

      const defaultLayerOptions = {
        visibilityRange: [
          this.form?.get('visibilityRangeStart')?.value,
          this.form?.get('visibilityRangeEnd')?.value,
        ],
        opacity: this.form?.get('opacity')?.value,
        fillOpacity: this.form?.get('opacity')?.value,
        visible: this.form?.get('defaultVisibility')?.value,
        style: this.form?.get('style')?.value,
      };
      const overlays: OverlayLayerTree = {
        layer: this.currentLayer,
        label: this.form.get('name')?.value,
        options: defaultLayerOptions,
      };

      // Then we use a timeout to add the new layer in order to delete the previous layer if so
      setTimeout(() => {
        this.addOrDeleteLayer.next({ layerData: overlays, isDelete: false });
      }, 0);

      this.updateLayerOptions(defaultLayerOptions);
    }
  }
  /**
   * Handle leaflet map events
   *
   * @param event leaflet map event
   */
  public handleMapEvent(event: MapEvent) {
    if (event) {
      switch (event.type) {
        case MapEventType.ZOOM_END:
          this.mapSettings.zoom = event.content.zoom;
          const visibilityRange = [
            this.form.get('visibilityRangeStart')?.value,
            this.form.get('visibilityRangeEnd')?.value,
          ];
          if (this.currentLayer) {
            this.updateLayerOptions({ visibilityRange });
          }
          break;
        default:
          break;
      }
    }
  }
}
