import { Apollo, QueryRef } from 'apollo-angular';
import { Component, AfterViewInit, Input, Inject } from '@angular/core';
import get from 'lodash/get';
import {
  QueryBuilderService,
  QueryResponse,
} from '../../../services/query-builder/query-builder.service';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
// import { takeUntil } from 'rxjs/operators';

import 'leaflet.control.layers.tree';
import {
  complexGeoJSON,
  cornerGeoJSON,
  heatMapGeoJSON,
  pointGeoJSON,
} from './geojson-test';
import { Feature, Point } from 'geojson';
import { HeatmapSettingsI } from '../map-settings/map-forms';

// Declares L to be able to use Leaflet from CDN
// Leaflet
//import 'leaflet.markercluster';
declare let L: any;

/** Default options for the marker */
const MARKER_OPTIONS = {
  color: '#0090d1',
  opacity: 0.25,
  weight: 12,
  fillColor: '#0090d1',
  fillOpacity: 1,
  radius: 6,
  pane: 'markers',
};

/** Declares an interface that will be used in the cluster markers layers */
interface IMarkersLayerValue {
  [name: string]: any;
}

// /** Interface for the properties of the geoJSON */
// type PropertiesI = {
//   heatmap?: {
//     id: string;
//     intensity: number;
//   };
//   [key: string]: any;
// } | null;

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

/**
 * Creates custom marker icon for the Leaflet map.
 *
 * @param color Color of the marker
 * @param opacity Opacity of the marker
 * @returns Custom marker icon
 */
const createCustomMarker = (color: string, opacity: number) => {
  const markerHtmlStyles = `
  background-color: ${color};
  opacity: ${opacity};
  width: 2em;
  height: 2em;
  display: block;
  left: -0.5em;
  top: -0.5em;
  position: relative;
  border-radius: 2em 2em 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;`;

  const icon = L.divIcon({
    className: 'custom-marker',
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span data-attr="${color},${opacity}" style="${markerHtmlStyles}">
      <div style="width: 0.7em; height: 0.7em; background-color: white; border-radius:100%"/>
    </span>`,
  });

  return icon;
};

/** Options when creating a heatmap */
type HeatmapOptions = {
  minOpacity: number;
  maxZoom: number;
  max: number;
  radius: number;
  blur: number;
  gradient: {
    intensity: number;
    color: string;
    legend: string;
  }[];
};

/**
 * Creates heatmap from the given data.
 *
 * @param data Points to create the heatmap from
 * @param options Options for the heatmap
 * @returns Heatmap layer
 */
const createHeatmap = (data: Feature[], options?: Partial<HeatmapOptions>) => {
  // return if any of the features is not a point
  if (data.some((f) => f.geometry.type !== 'Point')) return null;

  // parses the gradient array into an object expected by the heatmap plugin
  const gradient = options?.gradient?.reduce(
    (acc, { intensity, color }) => ({ ...acc, [intensity]: color }),
    {} as { [intensity: number]: string }
  );

  const heatmap = L.heatLayer(
    data.map((f) => {
      const intensity = f.properties?.heatmap?.intensity || 1;
      const coordinates = [...(f.geometry as Point).coordinates];

      // reverse and wrap coordinates
      return [coordinates[1] % 90, coordinates[0] % 180].concat(intensity);
    }),
    {
      minOpacity: options?.minOpacity || 0.5,
      maxZoom: options?.maxZoom || 18,
      max: options?.max || 1,
      radius: options?.radius || 25,
      blur: options?.blur || 15,
      gradient: gradient || {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1: 'red',
      },
    }
  );

  return heatmap;
};

/**
 * Creates a legend for the heatmap.
 *
 * @param steps Gradient steps for the heatmap
 * @returns The legend control
 */
const createHeatmapLegend = (steps: HeatmapOptions['gradient']) => {
  const legendControl = L.control({ position: 'bottomright' });

  legendControl.onAdd = () => {
    const div = L.DomUtil.create('div', 'info legend');
    const html = steps
      .map(
        ({ color, legend }) =>
          `<span style="display:flex;align-items: center;gap:1em"><div style="background-color:${color}; width:1em; height:1em"></div>${legend}</span>`
      )
      .join(' ');

    div.innerHTML = html;
    div.style.padding = '0.5em';
    div.style.backgroundColor = 'white';
    div.style.border = '1px solid #ccc';
    return div;
  };

  // prevent click events from propagating to the map
  if (legendControl.getContainer())
    legendControl.getContainer().addEventListener('click', (e: any) => {
      L.DomEvent.stopPropagation(e);
    });

  return legendControl;
};

/** Component for the map widget */
@Component({
  selector: 'safe-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
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

  // === HEATMAP ===
  private heatmap = {
    points: [] as Feature[],
    layer: null as any,
    legend: null as any,
  };

  // === LEGEND ===
  private legendControl: any;

  // === RECORDS ===
  private dataQuery!: QueryRef<QueryResponse>;

  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any = null;

  // === QUERY UPDATE INFO ===
  public lastUpdate = '';

  /**
   * Constructor of the map widget component
   *
   * @param environment platform environment
   * @param apollo Apollo client
   * @param queryBuilder The queryBuilder service
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) {
    super();
    this.esriApiKey = environment.esriApiKey;
    this.mapId = this.generateUniqueId();
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

  /** Once template is ready, build the map. */
  ngAfterViewInit(): void {
    // Creates the map and adds all the controls we use.
    this.drawMap();

    // Timeout to ensure the map is fully loaded.
    setTimeout(() => {
      this.map.invalidateSize();
      this.setupHeatmap();
    }, 500);

    // Gets the settings from the DB.
    // if (this.settings.query) {
    //   const builtQuery = this.queryBuilder.buildQuery(this.settings);
    //   if (!builtQuery) return;
    //   this.dataQuery = this.apollo.watchQuery({
    //     query: builtQuery,
    //     variables: {
    //       first: 100,
    //       filter: this.settings.query.filter,
    //     },
    //   });
    //   // Handles the settings data and changes the map accordingly.
    //   this.getData();
    // }
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

    // Adds all the controls we use to the map
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
    this.getSearchbarControl().addTo(this.map);

    // Creates a pane for markers so they are always shown in top, used in the marker options;
    // this.map.createPane('markers');
    // this.map.getPane('markers').style.zIndex = 650;

    // Set event listener to log map bounds when zooming, moving and resizing screen.
    this.map.on('moveend', () => {
      // console.log(this.map.getBounds());
    });

    this.map.on('zoomend', () => {
      this.applyOptions(this.map.getZoom(), this.overlays);
    });

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
          label: 'Heatmap',
          layer: {
            type: 'FeatureCollection',
            features: heatMapGeoJSON.features.slice(0, 1000),
          },
        },
      ],
    };

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
            if (layerTree.layer) layerTree.layer.addTo(this.map);
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
      layerTree.children.map((child) => {
        const newLayer = this.addTreeToMap(child);
        child.layer = L.geoJSON(newLayer.layer, {
          pointToLayer: (feature: any, latlng: any) => {
            // Each point can have a heatmap property
            // If they do they are grouped together
            if (feature.properties?.heatmap) {
              this.heatmap.points.push(feature);
              if (this.heatmap.points.length === 1) {
                // we create a single hidden marker that will be used to show/hide the heatmap
                const icon = createCustomMarker('', 0);
                const marker = new L.Marker(latlng).setIcon(icon);

                // when marked is hidden, we remove the heatmap
                marker.on('remove', () => {
                  if (this.heatmap.layer)
                    this.map.removeLayer(this.heatmap.layer);
                });

                // when marker is shown, we add the heatmap to the map
                marker.on('add', () => {
                  if (this.heatmap.layer) this.map.addLayer(this.heatmap.layer);
                });

                return marker;
              }
              return null;
            }
            // Circles are not supported by geojson
            // We abstract them as markers with a radius property
            else if (feature.properties?.radius) {
              return new L.Circle(latlng, feature.properties.radius);
            } else {
              const color = feature.properties.color || '#3388ff';
              const opacity = feature.properties.opacity || 1;
              const icon = createCustomMarker(color, opacity);
              return new L.Marker(latlng).setIcon(icon);
            }
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

    const results = L.layerGroup().addTo(this.map);

    searchControl.on('results', (data: any) => {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        const lat = Math.round(data.results[i].latlng.lat * 100000) / 100000;
        const lng = Math.round(data.results[i].latlng.lng * 100000) / 100000;
        const marker = L.circleMarker(data.results[i].latlng, MARKER_OPTIONS);
        marker.bindPopup(`
          <p>${data.results[i].properties.ShortLabel}</br>
          <b>${'latitude: '}</b>${lat}</br>
          <b>${'longitude: '}</b>${lng}</p>`);
        results.addLayer(marker);
        marker.openPopup();
      }
    });

    return searchControl;
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
   * Sets up heatmap
   *
   * @param hmConfig Heatmap settings (optional)
   */
  public setupHeatmap(hmConfig?: HeatmapSettingsI): void {
    if (!this.map) return;

    // if heatmap layer exists, remove it
    if (this.heatmap.layer) this.map.removeLayer(this.heatmap.layer);
    if (this.heatmap.legend) this.map.removeControl(this.heatmap.legend);

    const settings = hmConfig ?? get(this.settings, 'heatmap');

    // check if heatmap is enabled
    if (!settings?.enabled) return;

    const heatmap = createHeatmap(this.heatmap.points, settings);
    if (heatmap) {
      heatmap.addTo(this.map);
      this.heatmap.layer = heatmap;
    }

    const legend = createHeatmapLegend(settings.gradient);
    if (legend) {
      legend.addTo(this.map);
      this.heatmap.legend = legend;
    }
  }
}

// LEGACY CODE
// import { Apollo, QueryRef } from 'apollo-angular';
// import { Component, AfterViewInit, Input, Inject } from '@angular/core';
// import { applyFilters } from './filter';
// import { DomService } from '../../../services/dom/dom.service';
// import get from 'lodash/get';
// import { SafeMapPopupComponent } from './map-popup/map-popup.component';
// import {
//   QueryBuilderService,
//   QueryResponse,
// } from '../../../services/query-builder/query-builder.service';
// import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
// import { takeUntil } from 'rxjs/operators';

// // Declares L to be able to use Leaflet from CDN
// // Leaflet
// //import 'leaflet.markercluster';
// declare let L: any;

// /** Default options for the marker */
// const MARKER_OPTIONS = {
//   color: '#0090d1',
//   opacity: 0.25,
//   weight: 12,
//   fillColor: '#0090d1',
//   fillOpacity: 1,
//   radius: 6,
//   pane: 'markers',
// };

// /** Declares an interface that will be used in the cluster markers layers */
// interface IMarkersLayerValue {
//   [name: string]: any;
// }

// /** Available baseMaps */
// const BASEMAP_LAYERS: any = {
//   Streets: 'ArcGIS:Streets',
//   Navigation: 'ArcGIS:Navigation',
//   Topographic: 'ArcGIS:Topographic',
//   'Light Gray': 'ArcGIS:LightGray',
//   'Dark Gray': 'ArcGIS:DarkGray',
//   'Streets Relief': 'ArcGIS:StreetsRelief',
//   Imagery: 'ArcGIS:Imagery',
//   ChartedTerritory: 'ArcGIS:ChartedTerritory',
//   ColoredPencil: 'ArcGIS:ColoredPencil',
//   Nova: 'ArcGIS:Nova',
//   Midcentury: 'ArcGIS:Midcentury',
//   OSM: 'OSM:Standard',
//   'OSM:Streets': 'OSM:Streets',
// };

// /** Component for the map widget */
// @Component({
//   selector: 'safe-map',
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.scss'],
// })
// export class SafeMapComponent
//   extends SafeUnsubscribeComponent
//   implements AfterViewInit
// {
//   // === MAP ===
//   public mapId: string;
//   public map: any;
//   public esriApiKey: string;
//   private basemap: any;

//   // === MARKERS ===
//   private markersLayer: any = null;
//   private popupMarker: any;
//   private markersCategories: IMarkersLayerValue = [];
//   private overlays: IMarkersLayerValue = {};
//   private layerControl: any;

//   // === LEGEND ===
//   private legendControl: any;

//   // === RECORDS ===
//   private dataQuery!: QueryRef<QueryResponse>;
//   private fields: any[] = [];

//   // === WIDGET CONFIGURATION ===
//   @Input() header = true;
//   @Input() settings: any = null;

//   // === QUERY UPDATE INFO ===
//   public lastUpdate = '';

//   /**
//    * Constructor of the map widget component
//    *
//    * @param environment platform environment
//    * @param apollo Apollo client
//    * @param queryBuilder The queryBuilder service
//    * @param domService Shared dom service
//    */
//   constructor(
//     @Inject('environment') environment: any,
//     private apollo: Apollo,
//     private queryBuilder: QueryBuilderService,
//     private domService: DomService
//   ) {
//     super();
//     this.esriApiKey = environment.esriApiKey;
//     this.mapId = this.generateUniqueId();
//   }

//   /**
//    * Generation of an unique id for the map (in case multiple widgets use map).
//    *
//    * @param parts Number of parts in the id (separated by dashes "-")
//    * @returns A random unique id
//    */
//   private generateUniqueId(parts: number = 4): string {
//     const stringArr: string[] = [];
//     for (let i = 0; i < parts; i++) {
//       // eslint-disable-next-line no-bitwise
//       const S4 = (((1 + Math.random()) * 0x10000) | 0)
//         .toString(16)
//         .substring(1);
//       stringArr.push(S4);
//     }
//     return stringArr.join('-');
//   }

//   /** Once template is ready, build the map. */
//   ngAfterViewInit(): void {
//     // Creates the map and adds all the controls we use.
//     this.drawMap();

//     // Gets the settings from the DB.
//     if (this.settings.query) {
//       const builtQuery = this.queryBuilder.buildQuery(this.settings);
//       if (!builtQuery) return;
//       this.dataQuery = this.apollo.watchQuery({
//         query: builtQuery,
//         variables: {
//           first: 100,
//           filter: this.settings.query.filter,
//         },
//       });
//       // Handles the settings data and changes the map accordingly.
//       this.getData();
//     }

//     const flatQueryFields = this.getFields(
//       get(this.settings, 'query.fields', [])
//     );
//     const popupFields = get(this.settings, 'popupFields', []);
//     if (popupFields.length > 0) {
//       this.fields = flatQueryFields.filter((field) =>
//         popupFields.includes(field.name)
//       );
//     } else {
//       this.fields = flatQueryFields;
//     }

//     setTimeout(() => this.map.invalidateSize(), 100);
//   }

//   /**
//    * Flatten an array
//    *
//    * @param {any[]} arr - any[] - the array to be flattened
//    * @returns the array with all the nested arrays flattened.
//    */
//   private flatDeep(arr: any[]): any[] {
//     return arr.reduce(
//       (acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val),
//       []
//     );
//   }

//   /**
//    * Get list of query fields from settings
//    *
//    * @param fields list of fields
//    * @param prefix prefix to add to field name
//    * @returns flat list of fields
//    */
//   private getFields(
//     fields: any[],
//     prefix?: string
//   ): { name: string; label: string }[] {
//     return this.flatDeep(
//       fields
//         .filter((x) => x.kind !== 'LIST')
//         .map((f) => {
//           switch (f.kind) {
//             case 'OBJECT': {
//               return this.getFields(f.fields, f.name);
//             }
//             default: {
//               return {
//                 name: prefix ? `${prefix}.${f.name}` : f.name,
//                 label: f.label,
//               };
//             }
//           }
//         })
//     );
//   }

//   /** Creates the map and adds all the controls we use */
//   private drawMap(): void {
//     // Set bounds
//     const centerLong = Number(get(this.settings, 'centerLong', 0));
//     const centerLat = Number(get(this.settings, 'centerLat', 0));
//     const bounds = L.latLngBounds(L.latLng(-90, -1000), L.latLng(90, 1000));

//     // Create leaflet map
//     this.map = L.map(this.mapId, {
//       zoomControl: false,
//       maxBounds: bounds,
//       minZoom: 2,
//       maxZoom: 18,
//       worldCopyJump: true,
//       zoom: get(this.settings, 'zoom', 3),
//     }).setView([centerLat, centerLong], get(this.settings, 'zoom', 3));

//     // TODO: see if fixable, issue is that it does not work if leaflet not put in html imports
//     this.setBasemap(this.settings.basemap);

//     // Adds all the controls we use to the map
//     L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
//     this.getSearchbarControl().addTo(this.map);
//     this.legendControl = this.getLegendControl().addTo(this.map);

//     // Creates a pane for markers so they are always shown in top, used in the marker options;
//     this.map.createPane('markers');
//     this.map.getPane('markers').style.zIndex = 650;
//   }

//   /** Load the data, using widget parameters. */
//   private getData(): void {
//     this.map.closePopup(this.popupMarker);

//     this.dataQuery.valueChanges
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((res) => {
//         const today = new Date();
//         this.lastUpdate =
//           ('0' + today.getHours()).slice(-2) +
//           ':' +
//           ('0' + today.getMinutes()).slice(-2);
//         // Empties all variables used in map
//         this.setLayers(res);
//         this.legendControl.update(
//           this.map,
//           this.settings,
//           this.overlays,
//           Object.keys(this.markersCategories)
//         );
//       });
//   }

//   /**
//    * Checks all the data passed and generates new layers accordingly.
//    *
//    * @param res data query result
//    */
//   private setLayers(res: any): void {
//     // Removes layer control and clears all marker sub-layers from the cluster group
//     if (this.layerControl) {
//       this.layerControl.remove();
//     }

//     // Creates a featureGroup which will contain all the markers/pointer
//     if (!this.markersLayer) {
//       const markersLayerGroup = L.featureGroup().addTo(this.map);
//       // Deactivated cluster feature
//       // this.markersLayer = L.markerClusterGroup({}).addTo(markersLayerGroup);
//       this.markersLayer = markersLayerGroup;
//     } else {
//       this.markersLayer.clearLayers();
//     }

//     // Loops through fields to get all markers
//     this.markersCategories = [];
//     for (const field in res.data) {
//       if (Object.prototype.hasOwnProperty.call(res.data, field)) {
//         res.data[field].edges.map((x: any) => {
//           // Creates the marker
//           this.setMarker(x.node);
//         });
//       }
//     }

//     // setting up layer with all markers, if it doesn't exist
//     if (!this.markersCategories.hasOwnProperty('Markers')) {
//       const allLayers: any[] = [];
//       Object.keys(this.markersCategories).forEach((name: string) => {
//         allLayers.push(...this.markersCategories[name]);
//       });
//       // eslint-disable-next-line @typescript-eslint/dot-notation
//       this.markersCategories['undefined'] = allLayers;
//     }

//     // Renders all the markers
//     Object.keys(this.markersCategories).map((name: string) => {
//       if (name !== 'null') {
//         const layerName = name !== 'undefined' ? name : 'Markers';
//         this.overlays[layerName] = L.featureGroup
//           .subGroup(this.markersLayer, this.markersCategories[name])
//           .addTo(this.map);
//         this.overlays[layerName].type = 'Marker';
//       }
//     });

//     // Loops through clorophlets and adds them to the map
//     if (this.settings.clorophlets) {
//       this.settings.clorophlets.map((value: any) => {
//         if (value.divisions.length > 0) {
//           // Renders the clorophlet
//           this.overlays[value.name] = this.setClorophlet(value, res.data).addTo(
//             this.map
//           );
//           this.overlays[value.name].type = 'Clorophlet';
//         }
//       });
//     }

//     // Loops through online layers and add them to the map
//     if (this.settings.onlineLayers) {
//       this.settings.onlineLayers.map((layer: any) => {
//         this.overlays[layer.title] = L.esri.featureLayer({
//           url: layer.url + '/0',
//           simplifyFactor: 1,
//           apikey: this.esriApiKey,
//         });
//         this.overlays[layer.title].metadata((error: any) => {
//           if (!error) {
//             this.overlays[layer.title].addTo(this.map);
//           } else {
//             console.error(error);
//           }
//         });
//       });
//     }
//     // Set ups a layer control with the new layers.
//     if (Object.keys(this.overlays).length > 0) {
//       this.layerControl = L.control
//         .layers(null, this.overlays, { collapsed: true })
//         .addTo(this.map);
//     }
//   }

//   /**
//    * Creates a marker with the data passed and adds it to the corespondent category.
//    *
//    * @param item data of the marker
//    */
//   private setMarker(item: any): void {
//     const latitude = Number(get(item, this.settings.latitude, undefined));
//     const longitude = Number(get(item, this.settings.longitude, undefined));
//     if (!isNaN(latitude) && latitude >= -90 && latitude <= 90) {
//       if (!isNaN(longitude) && longitude >= -180 && longitude <= 180) {
//         // Sets the style of the marker depending on the rules applied.
//         const options = Object.assign({}, MARKER_OPTIONS);
//         Object.assign(options, { id: item.id });
//         this.settings.markerRules?.map((rule: any, i: any) => {
//           if (applyFilters(item, rule.filter)) {
//             options.color = rule.color;
//             options.fillColor = rule.color;
//             options.weight *= rule.size;
//             options.radius *= rule.size;
//             Object.assign(options, { divisionID: `${rule.label}-${i}` });
//           }
//         });

//         // Creates the marker and adds it to the correct category.
//         const marker = L.circleMarker([latitude, longitude], options);
//         const category = get(item, this.settings.category, null);
//         if (!this.markersCategories[category]) {
//           this.markersCategories[category] = [];
//         }
//         this.markersCategories[category].push(marker);
//         marker.bindPopup(() => {
//           const div = document.createElement('div');
//           const popupContent = this.domService.appendComponentToBody(
//             SafeMapPopupComponent,
//             div
//           );
//           const instance = popupContent.instance;
//           instance.data = item;
//           instance.fields = this.fields;
//           this.popupMarker = L.popup({
//             width: 350,
//           })
//             .setLatLng([latitude, longitude])
//             .setContent(div)
//             .addTo(this.map);
//           instance.loaded.subscribe(() => this.popupMarker.update());
//           return;
//         });
//       }
//     }
//   }

//   /**
//    * Creates a clorophlet using the passed data.
//    *
//    * @param value Properties of the clorophlet.
//    * @param data Query data fed to the clorophlet.
//    * @returns a geoJSON layer
//    */
//   private setClorophlet(value: any, data: any) {
//     return L.geoJson(JSON.parse(value.geoJSON), {
//       interactive: false,
//       style: (feature: any): any => {
//         let color = 'transparent';
//         let label = '';
//         for (const field in data) {
//           if (Object.prototype.hasOwnProperty.call(data, field)) {
//             data[field].edges.map((entry: any) => {
//               if (
//                 entry.node[value.place] &&
//                 feature.properties[value.geoJSONfield] &&
//                 entry.node[value.place].toString() ===
//                   feature.properties[value.geoJSONfield].toString()
//               ) {
//                 value.divisions.map((div: any, i: number) => {
//                   if (applyFilters(entry.node, div.filter)) {
//                     color = div.color;
//                     label = div.label.empty ? 'Division ' + (i + 1) : div.label;
//                   }
//                 });
//               }
//             });
//           }
//         }
//         return {
//           fillColor: color,
//           fillOpacity: value.opacity / 100 || 1,
//           weight: 0.5,
//           opacity: 1,
//           color: color === 'transparent' ? 'transparent' : 'white',
//           label,
//         };
//       },
//     });
//   }

//   /**
//    * Returns a custom legend control.
//    *
//    * @returns Returns the custom control
//    */
//   private getLegendControl(): any {
//     const legendControl = L.control({ position: 'bottomright' });

//     /**
//      *  Defines the method which will be called when the legend control is added to the map
//      *
//      * @returns legend container
//      */
//     legendControl.onAdd = function () {
//       this.div = L.DomUtil.create('div', 'map-legend-container');
//       return this.div;
//     };

//     /**
//      * Defines a method to be able to update the legend control once it is already added to the map
//      *
//      * @param map current leaflet map
//      * @param data current map data
//      * @param overlays list of overlays
//      * @param markersNames list of markers
//      */
//     legendControl.update = function (
//       map: any,
//       data: any,
//       overlays: any,
//       markersNames: string[]
//     ) {
//       const div = this.div;
//       div.innerHTML = '';
//       // Prevent double click on legend panel to zoom
//       L.DomEvent.on(div, 'dblclick', (e: any) => {
//         e.stopPropagation();
//       });
//       // Prevent scroll on legend panel to zoom
//       L.DomEvent.on(div, 'mousewheel', (e: any) => {
//         e.stopPropagation();
//       });
//       // Creates legend for clorophlets
//       data.clorophlets?.map((clorophlet: any) => {
//         const layer = overlays[clorophlet.name];

//         if (clorophlet.divisions.length > 0) {
//           // Generates header of legend
//           const legendLayerDiv = L.DomUtil.create('div', 'map-legend', div);
//           const legendLayerHeader = L.DomUtil.create(
//             'div',
//             'map-legend-header',
//             legendLayerDiv
//           );
//           legendLayerHeader.innerHTML = `<h4>${clorophlet.name}</h4>`;
//           L.DomEvent.on(
//             legendLayerHeader,
//             'click',
//             () => {
//               if (map.hasLayer(layer)) {
//                 L.DomUtil.addClass(legendLayerDiv, 'map-legend-hide');
//                 map.removeLayer(layer);
//               } else {
//                 map.addLayer(layer);
//                 L.DomUtil.removeClass(legendLayerDiv, 'map-legend-hide');
//               }
//             },
//             this
//           );
//           // Generates divisions legend
//           clorophlet.divisions.map((division: any, i: number) => {
//             const legendDivisionDiv = L.DomUtil.create(
//               'div',
//               'map-legend-division',
//               legendLayerDiv
//             );
//             legendDivisionDiv.innerHTML =
//               '<i style="background:' +
//               division.color +
//               '"></i>' +
//               (division.label.length > 0
//                 ? division.label
//                 : 'Division ' + (i + 1)) +
//               '<br>';
//             L.DomEvent.on(
//               legendDivisionDiv,
//               'click',
//               () => {
//                 // eslint-disable-next-line no-underscore-dangle
//                 const layers = overlays[clorophlet.name]._layers;
//                 const isHidden = L.DomUtil.hasClass(
//                   legendDivisionDiv,
//                   'legend-division-hide'
//                 );
//                 if (isHidden) {
//                   L.DomUtil.removeClass(
//                     legendDivisionDiv,
//                     'legend-division-hide'
//                   );
//                   Object.keys(layers).forEach((layerName: any) => {
//                     const divisionLayer = layers[layerName];
//                     if (divisionLayer.options.label === division.label)
//                       map.addLayer(divisionLayer);
//                   });
//                 } else {
//                   L.DomUtil.addClass(legendDivisionDiv, 'legend-division-hide');
//                   Object.keys(layers).forEach((layerName: any) => {
//                     const divisionLayer = layers[layerName];
//                     if (divisionLayer.options.label === division.label)
//                       map.removeLayer(divisionLayer);
//                   });
//                 }
//               },
//               this
//             );
//           });
//         }
//       });
//       // Creates legend for markers
//       if (data.markerRules && data.markerRules.length > 0) {
//         const legendLayerDiv = L.DomUtil.create('div', 'map-legend', div);
//         const legendLayerHeader = L.DomUtil.create(
//           'div',
//           'map-legend-header',
//           legendLayerDiv
//         );
//         legendLayerHeader.innerHTML = `<h4>Markers</h4>`;
//         L.DomEvent.on(
//           legendLayerHeader,
//           'click',
//           () => {
//             markersNames.map((marker: string) => {
//               const layer =
//                 marker === 'undefined' ? overlays.Markers : overlays[marker];
//               if (map.hasLayer(layer)) {
//                 L.DomUtil.addClass(legendLayerDiv, 'map-legend-hide');
//                 map.removeLayer(layer);
//               } else {
//                 map.addLayer(layer);
//                 L.DomUtil.removeClass(legendLayerDiv, 'map-legend-hide');
//               }
//             });
//           },
//           this
//         );
//         data.markerRules?.map((rule: any, i: number) => {
//           const legendDivisionDiv = L.DomUtil.create(
//             'div',
//             'map-legend-division',
//             legendLayerDiv
//           );
//           legendDivisionDiv.innerHTML =
//             '<i style="background:' +
//             rule.color +
//             '"></i>' +
//             rule.label +
//             '<br>';

//           L.DomEvent.on(
//             legendDivisionDiv,
//             'click',
//             () => {
//               // eslint-disable-next-line no-underscore-dangle
//               const layers = overlays.Markers._layers;

//               // // array with all the clusters displayed and the markers in each of them
//               // const clusteredLayers: { cluster: any; hiddenMarkers: any[] }[] =
//               //   [];
//               // map.eachLayer((layer: any) => {
//               //   if (layer.getAllChildMarkers)
//               //     clusteredLayers.push({
//               //       cluster: layer,
//               //       hiddenMarkers: layer.getAllChildMarkers(),
//               //     });
//               // });
//               const isHidden = L.DomUtil.hasClass(
//                 legendDivisionDiv,
//                 'legend-division-hide'
//               );
//               if (isHidden) {
//                 L.DomUtil.removeClass(
//                   legendDivisionDiv,
//                   'legend-division-hide'
//                 );
//                 Object.keys(layers).map((layerName: any) => {
//                   const divisionLayer = layers[layerName];
//                   if (divisionLayer.options.divisionID === `${rule.label}-${i}`)
//                     map.addLayer(divisionLayer);
//                 });
//               } else {
//                 L.DomUtil.addClass(legendDivisionDiv, 'legend-division-hide');
//                 Object.keys(layers).map((layerName: any) => {
//                   const divisionLayer = layers[layerName];
//                   if (
//                     divisionLayer.options.divisionID === `${rule.label}-${i}`
//                   ) {
//                     // const cluster = clusteredLayers.find((c) =>
//                     //   c.hiddenMarkers.includes(divisionLayer)
//                     // );
//                     // // marker isn't in any cluster
//                     // if (!cluster) {
//                     map.removeLayer(divisionLayer);
//                     // } else {
//                     //   // cluster.cluster.removeLayer(divisionLayer);
//                     // }
//                   }
//                 });
//               }
//             },
//             this
//           );
//         });
//       }
//       if (div.innerHTML.length === 0) {
//         div.style.display = 'none';
//       }
//     };

//     return legendControl;
//   }

//   /**
//    * Creates a custom searchbar control with esri geocoding
//    *
//    * @returns Returns the custom control
//    */
//   private getSearchbarControl(): any {
//     const searchControl = L.esri.Geocoding.geosearch({
//       position: 'topleft',
//       placeholder: 'Enter an address or place e.g. 1 York St',
//       useMapBounds: false,
//       providers: [
//         L.esri.Geocoding.arcgisOnlineProvider({
//           apikey: this.esriApiKey,
//           nearby: {
//             lat: -33.8688,
//             lng: 151.2093,
//           },
//         }),
//       ],
//     });

//     const results = L.layerGroup().addTo(this.map);

//     searchControl.on('results', (data: any) => {
//       results.clearLayers();
//       for (let i = data.results.length - 1; i >= 0; i--) {
//         const lat = Math.round(data.results[i].latlng.lat * 100000) / 100000;
//         const lng = Math.round(data.results[i].latlng.lng * 100000) / 100000;
//         const marker = L.circleMarker(data.results[i].latlng, MARKER_OPTIONS);
//         marker.bindPopup(`
//           <p>${data.results[i].properties.ShortLabel}</br>
//           <b>${'latitude: '}</b>${lat}</br>
//           <b>${'longitude: '}</b>${lng}</p>`);
//         results.addLayer(marker);
//         marker.openPopup();
//       }
//     });

//     return searchControl;
//   }

//   /**
//    * Set the basemap.
//    *
//    * @param basemap String containing the id (name) of the basemap
//    */
//   public setBasemap(basemap: string) {
//     if (this.basemap) {
//       this.basemap.remove();
//     }
//     const basemapName = get(BASEMAP_LAYERS, basemap, BASEMAP_LAYERS.OSM);
//     this.basemap = L.esri.Vector.vectorBasemapLayer(basemapName, {
//       apiKey: this.esriApiKey,
//     }).addTo(this.map);
//   }
// }
