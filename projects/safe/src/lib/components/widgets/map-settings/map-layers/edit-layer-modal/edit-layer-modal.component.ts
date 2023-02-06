import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { createLayerForm } from '../../map-forms';
import { MapLayerI } from '../map-layers.component';
import get from 'lodash/get';

declare let L: any;

/** Available baseMaps */
const BASEMAP_LAYERS: any = {
  Streets: 'ArcGIS:Streets',
  Navigation: 'ArcGIS:Navigation',
  Topographic: 'ArcGIS:Topographic',
  'Light Gray': 'ArcGIS:LightGray',
  'Dark Gray': 'ArcGIS:DarkGray',
  'Streets Relief': 'ArcGIS:StreetsRelief',
  Imagery: 'ArcGIS:Imagery',
  ChartedTerritory: 'ArcGIS:ChartedTerritory',
  ColoredPencil: 'ArcGIS:ColoredPencil',
  Nova: 'ArcGIS:Nova',
  Midcentury: 'ArcGIS:Midcentury',
  OSM: 'OSM:Standard',
  'OSM:Streets': 'OSM:Streets',
};

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
export class SafeEditLayerModalComponent implements OnInit, AfterViewInit {
  public form: UntypedFormGroup;

  private currentLayer: any;
  public currentZoom = 2;

  // === MAP ===
  public mapId: string;
  public map: any;
  public esriApiKey: string;
  private basemap: any;

  /**
   * Modal for adding and editing map layers
   *
   * @param environment platform environment
   * @param layer Injected map layer, if any
   */
  constructor(
    @Inject('environment') environment: any,
    @Inject(MAT_DIALOG_DATA) public layer?: MapLayerI
  ) {
    this.form = createLayerForm(layer);
    this.esriApiKey = environment.esriApiKey;
    this.mapId = this.generateUniqueId();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.drawMap();
    setTimeout(() => this.map.invalidateSize(), 100);
  }

  /**
   * Generation of an unique id for the map (in case multiple widgets use map).
   *
   * @param parts Number of parts in the id (separated by dashes "-")
   * @returns A random unique id
   */
  private generateUniqueId(parts: number = 4): string {
    const stringArr: string[] = [];
    for (let i = 0; i < parts; i++) {
      // eslint-disable-next-line no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }

  /** Creates the map and adds all the controls we use */
  private drawMap(): void {
    // Set bounds
    const centerLong = 0;
    const centerLat = 0;
    const bounds = L.latLngBounds(L.latLng(-90, -1000), L.latLng(90, 1000));

    // Create leaflet map
    this.map = L.map(this.mapId, {
      fullscreenControl: true,
      zoomControl: false,
      maxBounds: bounds,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      zoom: 2,
    }).setView([centerLat, centerLong], 2);

    // TODO: see if fixable, issue is that it does not work if leaflet not put in html imports
    this.setBasemap('OSM');

    // Adds all the controls we use to the map
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    // Creates a pane for markers so they are always shown in top, used in the marker options;
    // this.map.createPane('markers');
    // this.map.getPane('markers').style.zIndex = 650;

    // Set event listener to log map bounds when zooming, moving and resizing screen.
    this.map.on('moveend', () => {
      console.log(this.map.getBounds());
    });

    this.currentLayer = L.geoJSON(testGeojson);

    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      this.currentZoom = zoom;
      const visibilityRange = this.form.get('visibilityRange')?.value;
      this.zoomUpdate(zoom, visibilityRange);
    });

    this.form.controls.visibilityRange.valueChanges.subscribe(
      (value: number[]) => {
        this.zoomUpdate(this.map.getZoom(), value);
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

    const overlays = {
      label: this.form.get('name')?.value,
      layer: this.currentLayer,
    };

    L.control.layers.tree(undefined, overlays).addTo(this.map);
  }

  /**
   * Set the basemap.
   *
   * @param basemap String containing the id (name) of the basemap
   */
  public setBasemap(basemap: string) {
    if (this.basemap) {
      this.basemap.remove();
    }
    const basemapName = get(BASEMAP_LAYERS, basemap, BASEMAP_LAYERS.OSM);
    this.basemap = L.esri.Vector.vectorBasemapLayer(basemapName, {
      apiKey: this.esriApiKey,
    }).addTo(this.map);
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
    this.map.addLayer(this.currentLayer);
    if (!this.form.get('defaultVisibility')?.value) {
      this.map.removeLayer(this.currentLayer);
    } else {
      const visibilityRange = this.form.get('visibilityRange')?.value;
      if (zoom > visibilityRange[1] || zoom < visibilityRange[0]) {
        this.map.removeLayer(this.currentLayer);
      } else {
        this.currentLayer.addTo(this.map);
      }
    }
  }

  /**
   * Function used to update layer visibility regarding the zoom.
   *
   * @param zoom The current zoom of the map
   * @param visibilityRange The visibility range based on map zoom
   */
  private zoomUpdate(zoom: number, visibilityRange: number[]): void {
    if (zoom > visibilityRange[1] || zoom < visibilityRange[0]) {
      this.map.removeLayer(this.currentLayer);
    } else {
      this.currentLayer.addTo(this.map);
    }
  }
}
