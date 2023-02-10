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

declare let L: any;

/** Layer used to test the component */
const testGeojson = {
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

  // === MAP ===
  public mapSettings!: MapConstructorSettings;
  private addLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public layerToAdd$ = this.addLayer.asObservable();
  private updateLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public updateLayer$ = this.updateLayer.asObservable();

  /**
   * Modal for adding and editing map layers
   *
   * @param layer Injected map layer, if any
   */
  constructor(@Inject(MAT_DIALOG_DATA) public layer?: MapLayerI) {
    super();
    this.form = createLayerForm(layer);
  }

  ngAfterViewInit(): void {
    this.configureMapSettings();
    this.currentLayer = L.geoJSON(testGeojson);
    const overlays = {
      label: this.form.get('name')?.value,
      layer: this.currentLayer,
    };
    this.addLayer.next(overlays);
    const defaultLayerOptions = {
      visibilityRange: this.form?.get('visibilityRange')?.value ?? true,
      opacity: this.form?.get('opacity')?.value ?? true,
      fillOpacity: this.form?.get('opacity')?.value ?? true,
      visible: this.form?.get('defaultVisibility')?.value ?? true,
    };
    this.updateLayerOptions(defaultLayerOptions);
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
  private updateLayerOptions(options: { [key: string]: any }) {
    this.layerOptions = {
      ...this.layerOptions,
      ...options,
    };
    this.updateLayer.next({
      layer: this.currentLayer,
      options: this.layerOptions,
    });
  }

  /**
   * Set edit layers listeners.
   */
  private setUpEditLayerListeners() {
    this.form.controls.visibilityRange.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number[]) => {
        // @TODO visibilityRange control only gives the value that we change in the  slider, not both(a plain number, not an array)
        // We have to fix this
        this.updateLayerOptions({ visibilityRange: value });
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
          const visibilityRange = this.form.get('visibilityRange')?.value;
          this.updateLayerOptions({ visibilityRange });
          break;
        default:
          break;
      }
    }
  }
}
