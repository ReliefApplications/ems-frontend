import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { createLayerForm } from '../../map-forms';
import { MapLayerI } from '../map-layers.component';
import get from 'lodash/get';
import {
  MapConstructorSettings,
  MapEvent,
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
  implements OnInit
{
  public form: UntypedFormGroup;

  private currentLayer: any;
  public currentZoom = 2;

  // === MAP ===
  public map: any;
  public settings!: MapConstructorSettings;

  private deleteLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public layerToAdd$ = this.deleteLayer.asObservable();
  private addLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public layerToDelete$ = this.addLayer.asObservable();
  private overlaysValue: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public overlaysValue$ = this.overlaysValue.asObservable();
  /**
   * Modal for adding and editing map layers
   *
   * @param environment platform environment
   * @param layer Injected map layer, if any
   */
  constructor(@Inject(MAT_DIALOG_DATA) public layer?: MapLayerI) {
    super();
    this.form = createLayerForm(layer);
  }

  ngOnInit(): void {
    this.configureMapSettings();
    this.setUpEditLayerListeners();

    this.currentLayer = L.geoJSON(testGeojson);
    const overlays = {
      label: this.form.get('name')?.value,
      layer: this.currentLayer,
    };
    this.overlaysValue.next(overlays);
    // L.control.layers.tree(undefined, overlays).addTo(this.map);
  }

  private configureMapSettings() {
    this.settings.centerLong = 0;
    this.settings.centerLat = 0;
    this.settings.maxBounds = L.latLngBounds(
      L.latLng(-90, -1000),
      L.latLng(90, 1000)
    );
    this.settings.baseMap = 'OSM';
    this.settings.zoomControl = true;
    this.settings.minZoom = 2;
    this.settings.maxZoom = 18;
    this.settings.zoom = 2;
    this.settings.worldCopyJump = true;
  }

  private setUpEditLayerListeners() {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (formValues) => {
        console.log(formValues);
      },
    });

    this.form.controls.visibilityRange.valueChanges.subscribe(
      (value: number[]) => {
        this.updateLayerVisibilityOnZoom(this.map.getZoom(), value);
      }
    );

    this.form.controls.opacity.valueChanges.subscribe((value: number) => {
      const layers = get(this.currentLayer, '_layers', []);
      for (const layer in layers) {
        if (layers[layer].options) {
          layers[layer].options.opacity = value;
          layers[layer].options.fillOpacity = value;
        }
      }
      this.map.removeLayer(this.currentLayer);
      this.map.addLayer(this.currentLayer);
    });

    this.applyOptions(this.map.getZoom());
  }

  /**
   * Function used to init the layer with saved options
   *
   * @param zoom The current zoom of the map
   */
  private applyOptions(zoom: number) {
    // eslint-disable-next-line no-underscore-dangle
    for (const layer in this.currentLayer._layers) {
      // eslint-disable-next-line no-underscore-dangle
      if (this.currentLayer._layers[layer].options) {
        // eslint-disable-next-line no-underscore-dangle
        this.currentLayer._layers[layer].options.opacity =
          this.form.get('opacity')?.value;
        // eslint-disable-next-line no-underscore-dangle
        this.currentLayer._layers[layer].options.fillOpacity =
          this.form.get('opacity')?.value;
      }
    }
    this.addLayer.next(this.currentLayer);
    if (!this.form.get('defaultVisibility')?.value) {
      this.deleteLayer.next(this.currentLayer);
    } else {
      const visibilityRange = this.form.get('visibilityRange')?.value;
      this.updateLayerVisibilityOnZoom(zoom, visibilityRange);
    }
  }

  /**
   * Function used to update layer visibility regarding the zoom.
   *
   * @param zoom The current zoom of the map
   * @param visibilityRange The visibility range based on map zoom
   */
  private updateLayerVisibilityOnZoom(
    zoom: number,
    visibilityRange: number[]
  ): void {
    if (zoom > visibilityRange[1] || zoom < visibilityRange[0]) {
      this.deleteLayer.next(this.currentLayer);
    } else {
      this.addLayer.next(this.currentLayer);
    }
  }

  public handleMapEvent(mapEvent: MapEvent) {
    if (mapEvent) {
      switch (mapEvent.type) {
        case 'moveend':
          console.log(mapEvent.content);
          break;
        case 'zoomend':
          const zoom = mapEvent.content;
          this.currentZoom = zoom;
          const visibilityRange = this.form.get('visibilityRange')?.value;
          this.updateLayerVisibilityOnZoom(zoom, visibilityRange);
          break;
        default:
          break;
      }
    }
  }
}
