import { Apollo, QueryRef } from 'apollo-angular';
import { Component, AfterViewInit, Input, Inject } from '@angular/core';
import { applyFilters } from './filter';
import { DomService } from '../../../services/dom/dom.service';
import get from 'lodash/get';
import { SafeMapPopupComponent } from './map-popup/map-popup.component';
import {
  QueryBuilderService,
  QueryResponse,
} from '../../../services/query-builder/query-builder.service';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { flatDeep } from '../../../utils/array-filter';

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
  private markersLayer: any = null;
  private popupMarker: any;
  private markersCategories: IMarkersLayerValue = [];
  private overlays: IMarkersLayerValue = {};
  private layerControl: any;

  // === LEGEND ===
  private legendControl: any;

  // === RECORDS ===
  private dataQuery!: QueryRef<QueryResponse>;
  private fields: any[] = [];

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
   * @param domService Shared dom service
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private domService: DomService
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

    // Gets the settings from the DB.
    if (this.settings.query) {
      const builtQuery = this.queryBuilder.buildQuery(this.settings);
      if (!builtQuery) return;
      this.dataQuery = this.apollo.watchQuery({
        query: builtQuery,
        variables: {
          first: 100,
          filter: this.settings.query.filter,
        },
      });
      // Handles the settings data and changes the map accordingly.
      this.getData();
    }

    const flatQueryFields = this.getFields(
      get(this.settings, 'query.fields', [])
    );
    const popupFields = get(this.settings, 'popupFields', []);
    if (popupFields.length > 0) {
      this.fields = flatQueryFields.filter((field) =>
        popupFields.includes(field.name)
      );
    } else {
      this.fields = flatQueryFields;
    }

    setTimeout(() => this.map.invalidateSize(), 100);
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
    return flatDeep(
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
    this.legendControl = this.getLegendControl().addTo(this.map);

    // Creates a pane for markers so they are always shown in top, used in the marker options;
    this.map.createPane('markers');
    this.map.getPane('markers').style.zIndex = 650;
  }

  /** Load the data, using widget parameters. */
  private getData(): void {
    this.map.closePopup(this.popupMarker);

    this.dataQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        const today = new Date();
        this.lastUpdate =
          ('0' + today.getHours()).slice(-2) +
          ':' +
          ('0' + today.getMinutes()).slice(-2);
        // Empties all variables used in map
        this.setLayers(res);
        this.legendControl.update(
          this.map,
          this.settings,
          this.overlays,
          Object.keys(this.markersCategories)
        );
      });
  }

  /**
   * Checks all the data passed and generates new layers accordingly.
   *
   * @param res data query result
   */
  private setLayers(res: any): void {
    // Removes layer control and clears all marker sub-layers from the cluster group
    if (this.layerControl) {
      this.layerControl.remove();
    }

    // Creates a featureGroup which will contain all the markers/pointer
    if (!this.markersLayer) {
      const markersLayerGroup = L.featureGroup().addTo(this.map);
      // Deactivated cluster feature
      // this.markersLayer = L.markerClusterGroup({}).addTo(markersLayerGroup);
      this.markersLayer = markersLayerGroup;
    } else {
      this.markersLayer.clearLayers();
    }

    // Loops throught fields to get all markers
    this.markersCategories = [];
    for (const field in res.data) {
      if (Object.prototype.hasOwnProperty.call(res.data, field)) {
        res.data[field].edges.map((x: any) => {
          // Creates the marker
          this.setMarker(x.node);
        });
      }
    }

    // setting up layer with all markers, if it doesn't exist
    // eslint-disable-next-line no-prototype-builtins
    if (!this.markersCategories.hasOwnProperty('Markers')) {
      const allLayers: any[] = [];
      Object.keys(this.markersCategories).forEach((name: string) => {
        allLayers.push(...this.markersCategories[name]);
      });
      // eslint-disable-next-line @typescript-eslint/dot-notation
      this.markersCategories['undefined'] = allLayers;
    }

    // Renders all the markers
    Object.keys(this.markersCategories).map((name: string) => {
      if (name !== 'null') {
        const layerName = name !== 'undefined' ? name : 'Markers';
        this.overlays[layerName] = L.featureGroup
          .subGroup(this.markersLayer, this.markersCategories[name])
          .addTo(this.map);
        this.overlays[layerName].type = 'Marker';
      }
    });

    // Loops through clorophlets and adds them to the map
    if (this.settings.clorophlets) {
      this.settings.clorophlets.map((value: any) => {
        if (value.divisions.length > 0) {
          // Renders the clorophlet
          this.overlays[value.name] = this.setClorophlet(value, res.data).addTo(
            this.map
          );
          this.overlays[value.name].type = 'Clorophlet';
        }
      });
    }

    // Loops throught online layers and add them to the map
    if (this.settings.onlineLayers) {
      this.settings.onlineLayers.map((layer: any) => {
        this.overlays[layer.title] = L.esri.featureLayer({
          url: layer.url + '/0',
          simplifyFactor: 1,
          apikey: this.esriApiKey,
        });
        this.overlays[layer.title].metadata((error: any) => {
          if (!error) {
            this.overlays[layer.title].addTo(this.map);
          } else {
            console.error(error);
          }
        });
      });
    }
    // Set ups a layer control with the new layers.
    if (Object.keys(this.overlays).length > 0) {
      this.layerControl = L.control
        .layers(null, this.overlays, { collapsed: true })
        .addTo(this.map);
    }
  }

  /**
   * Creates a marker with the data passed and adds it to the correspondant category.
   *
   * @param item data of the marker
   */
  private setMarker(item: any): void {
    const latitude = Number(get(item, this.settings.latitude, undefined));
    const longitude = Number(get(item, this.settings.longitude, undefined));
    if (!isNaN(latitude) && latitude >= -90 && latitude <= 90) {
      if (!isNaN(longitude) && longitude >= -180 && longitude <= 180) {
        // Sets the style of the marker depending on the rules applied.
        const options = Object.assign({}, MARKER_OPTIONS);
        Object.assign(options, { id: item.id });
        this.settings.markerRules?.map((rule: any, i: any) => {
          if (applyFilters(item, rule.filter)) {
            options.color = rule.color;
            options.fillColor = rule.color;
            options.weight *= rule.size;
            options.radius *= rule.size;
            Object.assign(options, { divisionID: `${rule.label}-${i}` });
          }
        });

        // Creates the marker and adds it to the correct category.
        const marker = L.circleMarker([latitude, longitude], options);
        const category = get(item, this.settings.category, null);
        if (!this.markersCategories[category]) {
          this.markersCategories[category] = [];
        }
        this.markersCategories[category].push(marker);
        marker.bindPopup(() => {
          const div = document.createElement('div');
          const popupContent = this.domService.appendComponentToBody(
            SafeMapPopupComponent,
            div
          );
          const instance = popupContent.instance;
          instance.data = item;
          instance.fields = this.fields;
          this.popupMarker = L.popup({
            width: 350,
          })
            .setLatLng([latitude, longitude])
            .setContent(div)
            .addTo(this.map);
          instance.loaded.subscribe(() => this.popupMarker.update());
          return;
        });
      }
    }
  }

  /**
   * Creates a clorophlet using the passed data.
   *
   * @param value Properties of the clorophlet.
   * @param data Query data feeded to the clorophlet.
   * @returns a geoJSON layer
   */
  private setClorophlet(value: any, data: any) {
    return L.geoJson(JSON.parse(value.geoJSON), {
      interactive: false,
      style: (feature: any): any => {
        let color = 'transparent';
        let label = '';
        for (const field in data) {
          if (Object.prototype.hasOwnProperty.call(data, field)) {
            data[field].edges.map((entry: any) => {
              if (
                entry.node[value.place] &&
                feature.properties[value.geoJSONfield] &&
                entry.node[value.place].toString() ===
                  feature.properties[value.geoJSONfield].toString()
              ) {
                value.divisions.map((div: any, i: number) => {
                  if (applyFilters(entry.node, div.filter)) {
                    color = div.color;
                    label = div.label.empty ? 'Division ' + (i + 1) : div.label;
                  }
                });
              }
            });
          }
        }
        return {
          fillColor: color,
          fillOpacity: value.opacity / 100 || 1,
          weight: 0.5,
          opacity: 1,
          color: color === 'transparent' ? 'transparent' : 'white',
          label,
        };
      },
    });
  }

  /**
   * Returns a custom legend control.
   *
   * @returns Returns the custom control
   */
  private getLegendControl(): any {
    const legendControl = L.control({ position: 'bottomright' });

    /**
     *  Defines the method which will be called when the legend control is added to the map
     *
     * @returns legend container
     */
    legendControl.onAdd = function () {
      this.div = L.DomUtil.create('div', 'map-legend-container');
      return this.div;
    };

    /**
     * Defines a method to be able to update the legend control once it is already added to the map
     *
     * @param map current leaflet map
     * @param data current map data
     * @param overlays list of overlays
     * @param markersNames list of markers
     */
    legendControl.update = function (
      map: any,
      data: any,
      overlays: any,
      markersNames: string[]
    ) {
      const div = this.div;
      div.innerHTML = '';
      // Prevent double click on legend panel to zoom
      L.DomEvent.on(div, 'dblclick', (e: any) => {
        e.stopPropagation();
      });
      // Prevent scroll on legend panel to zoom
      L.DomEvent.on(div, 'mousewheel', (e: any) => {
        e.stopPropagation();
      });
      // Creates legend for clorophlets
      data.clorophlets?.map((clorophlet: any) => {
        const layer = overlays[clorophlet.name];

        if (clorophlet.divisions.length > 0) {
          // Generates header of legend
          const legendLayerDiv = L.DomUtil.create('div', 'map-legend', div);
          const legendLayerHeader = L.DomUtil.create(
            'div',
            'map-legend-header',
            legendLayerDiv
          );
          legendLayerHeader.innerHTML = `<h4>${clorophlet.name}</h4>`;
          L.DomEvent.on(
            legendLayerHeader,
            'click',
            () => {
              if (map.hasLayer(layer)) {
                L.DomUtil.addClass(legendLayerDiv, 'map-legend-hide');
                map.removeLayer(layer);
              } else {
                map.addLayer(layer);
                L.DomUtil.removeClass(legendLayerDiv, 'map-legend-hide');
              }
            },
            this
          );
          // Generates divisions legend
          clorophlet.divisions.map((division: any, i: number) => {
            const legendDivisionDiv = L.DomUtil.create(
              'div',
              'map-legend-division',
              legendLayerDiv
            );
            legendDivisionDiv.innerHTML =
              '<i style="background:' +
              division.color +
              '"></i>' +
              (division.label.length > 0
                ? division.label
                : 'Division ' + (i + 1)) +
              '<br>';
            L.DomEvent.on(
              legendDivisionDiv,
              'click',
              () => {
                // eslint-disable-next-line no-underscore-dangle
                const layers = overlays[clorophlet.name]._layers;
                const isHidden = L.DomUtil.hasClass(
                  legendDivisionDiv,
                  'legend-division-hide'
                );
                if (isHidden) {
                  L.DomUtil.removeClass(
                    legendDivisionDiv,
                    'legend-division-hide'
                  );
                  Object.keys(layers).forEach((layerName: any) => {
                    const divisionLayer = layers[layerName];
                    if (divisionLayer.options.label === division.label)
                      map.addLayer(divisionLayer);
                  });
                } else {
                  L.DomUtil.addClass(legendDivisionDiv, 'legend-division-hide');
                  Object.keys(layers).forEach((layerName: any) => {
                    const divisionLayer = layers[layerName];
                    if (divisionLayer.options.label === division.label)
                      map.removeLayer(divisionLayer);
                  });
                }
              },
              this
            );
          });
        }
      });
      // Creates legend for markers
      if (data.markerRules && data.markerRules.length > 0) {
        const legendLayerDiv = L.DomUtil.create('div', 'map-legend', div);
        const legendLayerHeader = L.DomUtil.create(
          'div',
          'map-legend-header',
          legendLayerDiv
        );
        legendLayerHeader.innerHTML = `<h4>Markers</h4>`;
        L.DomEvent.on(
          legendLayerHeader,
          'click',
          () => {
            markersNames.map((marker: string) => {
              const layer =
                marker === 'undefined' ? overlays.Markers : overlays[marker];
              if (map.hasLayer(layer)) {
                L.DomUtil.addClass(legendLayerDiv, 'map-legend-hide');
                map.removeLayer(layer);
              } else {
                map.addLayer(layer);
                L.DomUtil.removeClass(legendLayerDiv, 'map-legend-hide');
              }
            });
          },
          this
        );
        data.markerRules?.map((rule: any, i: number) => {
          const legendDivisionDiv = L.DomUtil.create(
            'div',
            'map-legend-division',
            legendLayerDiv
          );
          legendDivisionDiv.innerHTML =
            '<i style="background:' +
            rule.color +
            '"></i>' +
            rule.label +
            '<br>';

          L.DomEvent.on(
            legendDivisionDiv,
            'click',
            () => {
              // eslint-disable-next-line no-underscore-dangle
              const layers = overlays.Markers._layers;

              // // array with all the clusters displayed and the markers in each of them
              // const clusteredLayers: { cluster: any; hiddenMarkers: any[] }[] =
              //   [];
              // map.eachLayer((layer: any) => {
              //   if (layer.getAllChildMarkers)
              //     clusteredLayers.push({
              //       cluster: layer,
              //       hiddenMarkers: layer.getAllChildMarkers(),
              //     });
              // });
              const isHidden = L.DomUtil.hasClass(
                legendDivisionDiv,
                'legend-division-hide'
              );
              if (isHidden) {
                L.DomUtil.removeClass(
                  legendDivisionDiv,
                  'legend-division-hide'
                );
                Object.keys(layers).map((layerName: any) => {
                  const divisionLayer = layers[layerName];
                  if (divisionLayer.options.divisionID === `${rule.label}-${i}`)
                    map.addLayer(divisionLayer);
                });
              } else {
                L.DomUtil.addClass(legendDivisionDiv, 'legend-division-hide');
                Object.keys(layers).map((layerName: any) => {
                  const divisionLayer = layers[layerName];
                  if (
                    divisionLayer.options.divisionID === `${rule.label}-${i}`
                  ) {
                    // const cluster = clusteredLayers.find((c) =>
                    //   c.hiddenMarkers.includes(divisionLayer)
                    // );
                    // // marker isn't in any cluster
                    // if (!cluster) {
                    map.removeLayer(divisionLayer);
                    // } else {
                    //   // cluster.cluster.removeLayer(divisionLayer);
                    // }
                  }
                });
              }
            },
            this
          );
        });
      }
      if (div.innerHTML.length === 0) {
        div.style.display = 'none';
      }
    };

    return legendControl;
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
}
