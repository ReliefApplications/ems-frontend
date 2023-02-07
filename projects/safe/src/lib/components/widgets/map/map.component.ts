import { Component, AfterViewInit, Input, Inject } from '@angular/core';
import get from 'lodash/get';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
// Leaflet plugins
import 'leaflet.markercluster';
import 'leaflet.control.layers.tree';
import 'leaflet-fullscreen';
import {
  complexGeoJSON,
  cornerGeoJSON,
  pointGeoJSON,
} from './tests/geojson/geojson-test';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { AVAILABLE_MEASURE_LANGUAGES } from './measure.const';
import { v4 as uuidv4 } from 'uuid';
import { randomFeatureCollection } from './generateFeatureCollection';
import { SafeMapService } from './map.service';

// Declares L to be able to use Leaflet from CDN
declare let L: any;

/** Default options for the marker */
const MARKER_OPTIONS = {
  color: '#0090d1',
  opacity: 0.25,
  weight: 12,
  fillColor: '#0090d1',
  fillOpacity: 1,
  radius: 6,
};

/** Declares an interface that will be used in the cluster markers layers */
interface IMarkersLayerValue {
  [name: string]: any;
}

/** Declares an interface that will be used in the overlays */
interface LayerTree {
  label?: string;
  children?: LayerTree[];
  layer?: any;
  type?: string;
  selectAllCheckbox?: any;
  options?: any;
}

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

/** Component for the map widget */
@Component({
  selector: 'safe-map',
  templateUrl: './map.component.html',
  styleUrls: ['../../../style/map.scss', './map.component.scss'],
})
export class SafeMapComponent
  extends SafeUnsubscribeComponent
  implements AfterViewInit
{
  // === MAP ===
  public mapId: string;
  public map: any;
  public esriApiKey: string;
  private basemap: any;

  // === MARKERS ===
  private popupMarker: any;
  private markersCategories: IMarkersLayerValue = [];
  private overlays: LayerTree = {};
  private layerControl: any;
  private addressMarker: any;

  // === Controls ===
  private lang!: string;
  private measureControls: any = {};
  private fullscreenControl?: L.Control;
  private legendControl?: L.Control;

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = null;

  // === QUERY UPDATE INFO ===
  public lastUpdate = '';

  // === THEME ===
  public primaryColor = '';

  /**
   * Constructor of the map widget component
   *
   * @param environment platform environment
   * @param translate The translate service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private safeMapService: SafeMapService
  ) {
    super();
    this.esriApiKey = environment.esriApiKey;
    this.mapId = uuidv4();
    this.primaryColor = environment.theme.primary;
    this.lang = this.translate.currentLang;
  }

  /** Once template is ready, build the map. */
  ngAfterViewInit(): void {
    // Creates the map and adds all the controls we use.
    this.drawMap();

    setTimeout(() => {
      this.map.invalidateSize();
      this.drawLayers();
    }, 100);
  }

  /**
   * Flatten an array
   *
   * @param {any[]} arr - any[] - the array to be flattened
   * @returns the array with all the nested arrays flattened.
   */
  private flatDeep(arr: any[]): any[] {
    return arr.reduce(
      (acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val),
      []
    );
  }

  /**
   * Get list of query fields from settings
   *
   * @param fields list of fields
   * @param prefix prefix to add to field name
   * @returns flat list of fields
   */
  private getFields(
    fields: any[],
    prefix?: string
  ): { name: string; label: string }[] {
    return this.flatDeep(
      fields
        .filter((x) => x.kind !== 'LIST')
        .map((f) => {
          switch (f.kind) {
            case 'OBJECT': {
              return this.getFields(f.fields, f.name);
            }
            default: {
              return {
                name: prefix ? `${prefix}.${f.name}` : f.name,
                label: f.label,
              };
            }
          }
        })
    );
  }

  /** Creates the map and adds all the controls we use */
  private drawMap(): void {
    // Set bounds
    const centerLong = Number(get(this.settings, 'centerLong', 0));
    const centerLat = Number(get(this.settings, 'centerLat', 0));
    const bounds = L.latLngBounds(L.latLng(-90, -1000), L.latLng(90, 1000));

    // Create leaflet map
    this.map = L.map(this.mapId, {
      zoomControl: false,
      maxBounds: bounds,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      zoom: get(this.settings, 'zoom', 3),
    }).setView([centerLat, centerLong], get(this.settings, 'zoom', 3));

    // TODO: see if fixable, issue is that it does not work if leaflet not put in html imports
    this.setBasemap(this.settings.basemap);

    // Add zoom control
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    // Add leaflet measure control
    this.getMeasureControl();

    // Add leaflet geosearch control
    this.getSearchbarControl().addTo(this.map);

    // Add leaflet fullscreen control
    this.getFullScreenControl();

    // Set event listener to log map bounds when zooming, moving and resizing screen.
    this.map.on('moveend', () => {
      // If searched address marker exists, if we move, the item should disappear
      if (this.addressMarker) {
        this.map.removeLayer(this.addressMarker);
        this.addressMarker = null;
      }
      console.log(this.map.getBounds());
    });

    this.map.on('zoomend', () => {
      this.applyOptions(this.map.getZoom(), this.overlays);
    });

    // Listen for language change
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.lang !== this.lang) {
          this.getMeasureControl();
          this.getFullScreenControl();
        }
      });
  }

  /**
   * Draw layers on map.
   */
  private drawLayers(): void {
    const options1 = {
      style: {
        opacity: 0.2,
      },
      visible: false,
      visibilityRange: {
        min: 6,
        max: 12,
      },
    };

    const options2 = {
      style: {
        opacity: 0.5,
      },
    };

    this.safeMapService.generateClusterLayer(this.map);

    this.overlays = {
      label: 'GeoJSON layers',
      selectAllCheckbox: 'Un/select all',
      children: [
        {
          label: 'Simple',
          layer: pointGeoJSON,
          options: options2,
        },
        {
          label: 'Complex',
          layer: complexGeoJSON,
          options: options1,
        },
        {
          label: 'Corner',
          layer: cornerGeoJSON,
          options: options2,
        },
        {
          label: 'Random',
          layer: randomFeatureCollection,
        },
      ],
    };

    // Heatmap
    this.safeMapService.generateHeatMap(this.map);

    const layerTreeCloned = this.addTreeToMap(this.overlays);
    this.applyOptions(this.map.getZoom(), layerTreeCloned, true);

    this.layerControl = L.control.layers
      .tree(undefined, layerTreeCloned)
      .addTo(this.map);
  }

  /**
   * Function used to apply options
   *
   * @param zoom The current zoom of the map
   * @param layerTree The layer tree, used recursively.
   * @param init Used to init the map or update layers, default false.
   */
  private applyOptions(zoom: number, layerTree: LayerTree, init = false) {
    if (layerTree.children) {
      for (const child of layerTree.children) {
        this.applyOptions(zoom, child, init);
      }
    } else if (layerTree.options) {
      if (init && layerTree.options.style) {
        const layers = get(layerTree, 'layer._layers', {});
        for (const layer in layers) {
          if (layers[layer].options) {
            layers[layer].options.opacity = layerTree.options.style.opacity;
            layers[layer].options.fillOpacity = layerTree.options.style.opacity;
          }
        }
        this.map.removeLayer(layerTree.layer);
        this.map.addLayer(layerTree.layer);
      }
      if (init && layerTree.options.visible === false) {
        // avoid undefined case matched with !layerTree.options.visible
        // init with layer set at not visible by default.
        this.map.removeLayer(layerTree.layer);
      } else {
        if (layerTree.options.visibilityRange) {
          if (
            zoom > layerTree.options.visibilityRange.max ||
            zoom < layerTree.options.visibilityRange.min
          ) {
            this.map.removeLayer(layerTree.layer);
          } else {
            layerTree.layer.addTo(this.map);
          }
        }
      }
    }
  }

  /**
   * Create a new layer tree with duplicated layers
   *
   * @param layerTree The layers tree.
   * @returns A tree with each layer duplicated to have a 'left' and 'right' clones
   */
  private addTreeToMap(layerTree: LayerTree): any {
    if (layerTree.children) {
      layerTree.children.map((child: any) => {
        const newLayer = this.addTreeToMap(child);
        child.layer = L.geoJSON(newLayer.layer, {
          // Check for icon property
          pointToLayer: (feature: any, latlng: any) => {
            const marker = L.marker(latlng);
            if (feature.properties?.icon?.svg) {
              const color = feature.properties.icon.color;
              const width = feature.properties.icon.width;
              const height = feature.properties.icon.height;
              const svg = feature.properties.icon.svg;

              const icon = L.divIcon({
                className: 'svg-marker',
                iconSize: [width, height],
                iconAnchor: [0, 24],
                labelAnchor: [-6, 0],
                popupAnchor: [width / 2, -36],
                html: `<span style="--color:${color}">${svg}</span>`,
              });

              return marker.setIcon(icon);
            }
            return marker;
          },
        }).addTo(this.map);
      });
    } else {
      let layerFeature: any[];
      if (layerTree.layer.type === 'Feature') {
        layerFeature = [layerTree.layer];
      } else {
        layerFeature = layerTree.layer.features;
      }

      const features: any[] = [];
      for (const feature of layerFeature) {
        features.push(feature);

        const left = {
          type: feature.type,
          properties: feature.properties,
          geometry: {
            coordinates: [] as any[],
            type: feature.geometry.type,
          },
        };
        const right = {
          type: feature.type,
          properties: feature.properties,
          geometry: {
            coordinates: [] as any[],
            type: feature.geometry.type,
          },
        };

        if (feature.geometry.type === 'Point') {
          const coordinate = feature.geometry.coordinates;
          left.geometry.coordinates = [coordinate[0] - 360, coordinate[1]];
          right.geometry.coordinates = [coordinate[0] + 360, coordinate[1]];
        } else {
          const leftCoordinates: any[] = [];
          const rightCoordinates: any[] = [];
          for (const coordinate of feature.geometry.coordinates[0]) {
            leftCoordinates.push([coordinate[0] - 360, coordinate[1]]);
            rightCoordinates.push([coordinate[0] + 360, coordinate[1]]);
          }
          left.geometry.coordinates.push(leftCoordinates);
          right.geometry.coordinates.push(rightCoordinates);
        }

        features.push(left);
        features.push(right);
      }

      layerTree.layer = {
        type: 'FeatureCollection',
        features,
      };
    }
    return layerTree;
  }

  /** Load the data, using widget parameters. */
  private getData(): void {
    this.map.closePopup(this.popupMarker);

    // this.dataQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
    //   const today = new Date();
    //   this.lastUpdate =
    //     ('0' + today.getHours()).slice(-2) +
    //     ':' +
    //     ('0' + today.getMinutes()).slice(-2);
    // });
  }

  /**
   * Creates a custom searchbar control with esri geocoding
   *
   * @returns Returns the custom control
   */
  private getSearchbarControl(): any {
    const searchControl = L.esri.Geocoding.geosearch({
      position: 'topleft',
      placeholder: 'Enter an address or place e.g. 1 York St',
      useMapBounds: false,
      providers: [
        L.esri.Geocoding.arcgisOnlineProvider({
          apikey: this.esriApiKey,
          nearby: {
            lat: -33.8688,
            lng: 151.2093,
          },
        }),
      ],
    });

    searchControl.on('results', (data: any) => {
      // results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        const coordinates = L.latLng(data.results[i].latlng);
        console.log(coordinates);
        const circle = L.circleMarker(coordinates, MARKER_OPTIONS);
        circle.addTo(this.map);
        const popup = L.popup()
          .setLatLng(coordinates)
          .setContent(
            `
          <p>${data.results[i].properties.ShortLabel}</br>
          <b>${'latitude: '}</b>${coordinates.lat}</br>
          <b>${'longitude: '}</b>${coordinates.lng}</p>`
          );
        circle.bindPopup(popup);
        popup.on('remove', () => this.map.removeLayer(circle));
        circle.openPopup();
        // Use setTimeout to prevent the marker to be removed while
        // the map moves to the searched address and is re-centred
        setTimeout(() => {
          this.addressMarker = circle;
        }, 1000);
      }
    });

    return searchControl;
  }

  /**
   * Create a fullscreen control and add it to map.
   * Support translation.
   */
  private getFullScreenControl(): void {
    if (this.fullscreenControl) {
      this.map.removeControl(this.fullscreenControl);
    }
    this.fullscreenControl = new L.Control.Fullscreen({
      title: {
        false: this.translate.instant('common.viewFullscreen'),
        true: this.translate.instant('common.exitFullscreen'),
      },
    });
    this.fullscreenControl?.addTo(this.map);
  }

  /** Create a custom measure control with leaflet-measure and adds it to the map  */
  private getMeasureControl(): any {
    // Get lang from translate service, and use default one if no match provided by plugin
    const lang = AVAILABLE_MEASURE_LANGUAGES.includes(
      this.translate.currentLang
    )
      ? this.translate.currentLang
      : 'en';
    // Check if one control was already added for the lang
    if (!this.measureControls[lang]) {
      // import related file, and build control
      import(`leaflet-measure/dist/leaflet-measure.${lang}.js`).then(() => {
        const control = new L.Control.Measure({
          position: 'bottomleft',
          primaryLengthUnit: 'kilometers',
          primaryAreaUnit: 'sqmeters',
          activeColor: this.primaryColor,
          completedColor: this.primaryColor,
        });
        this.measureControls[lang] = control;
        // Remove previous control if exists
        if (this.measureControls[this.lang]) {
          this.map.removeControl(this.measureControls[this.lang]);
        }
        control.addTo(this.map);
        this.lang = lang;
      });
    } else {
      // Else, load control and remove previous one
      this.map.removeControl(this.measureControls[this.lang]);
      this.measureControls[lang].addTo(this.map);
      this.lang = lang;
    }
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
}
