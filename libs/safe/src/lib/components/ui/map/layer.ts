// Leaflet imports
import * as L from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';

import { Feature, Geometry } from 'geojson';
import { get, set } from 'lodash';
import {
  LayerType,
  LayerFilter,
  GeoJSON,
} from './interfaces/layer-settings.type';
import {
  createCustomDivIcon,
  DEFAULT_MARKER_ICON_OPTIONS,
} from './utils/create-div-icon';
import {
  LayerDatasource,
  LayerDefinition,
  LayerModel,
  LayerSymbol,
  PopupInfo,
} from '../../../models/layer.model';
import { SafeMapPopupService } from './map-popup/map-popup.service';
import { haversineDistance } from './utils/haversine';
import { SafeIconDisplayPipe } from '../../../pipes/icon-display/icon-display.pipe';
import { GradientPipe } from '../../../pipes/gradient/gradient.pipe';

type FieldTypes = 'string' | 'number' | 'boolean' | 'date' | 'any';

/** GeoJSON with no features */
export const EMPTY_FEATURE_COLLECTION: GeoJSON = {
  type: 'FeatureCollection',
  features: [],
};

/** Default layer properties */
export const DEFAULT_LAYER_PROPERTIES = {
  minZoom: 1,
  maxZoom: 18,
  opacity: 1,
  visibility: true,
  legend: {
    display: false,
  },
};

/** Default layer filter */
export const DEFAULT_LAYER_FILTER: LayerFilter = {
  condition: 'and',
  filters: [],
};

/** Default gradient for heatmap */
const DEFAULT_GRADIENT = [
  {
    color: 'blue',
    ratio: 0,
  },
  {
    color: 'red',
    ratio: 1,
  },
];

/** Default heatmap parameters */
export const DEFAULT_HEATMAP = {
  gradient: DEFAULT_GRADIENT,
  blur: 15,
  radius: 25,
  minOpacity: 0.4,
};

/** Minimum cluster size in pixel */
const MIN_CLUSTER_SIZE = 20;

/** Maximum cluster size in pixel */
const MAX_CLUSTER_SIZE = 100;

/** All existing geometry types */
const GEOMETRY_TYPES = [
  'Point',
  'MultiPoint',
  'LineString',
  'MultiLineString',
  'Polygon',
  'MultiPolygon',
  'GeometryCollection',
];

/**
 * Checks if a feature satisfies a filter
 *
 * @param feature Feature to check
 * @param filter Filter to apply
 * @returns true if the feature satisfies the filter
 */
const featureSatisfiesFilter = (
  feature: Feature<Geometry>,
  filter: LayerFilter
): boolean => {
  // Check if the filter is a simple filter
  if ('filters' in filter) {
    const op = filter.condition === 'and' ? 'every' : 'some';
    return filter.filters[op]((f) => featureSatisfiesFilter(feature, f));
  } else {
    // Filter is a simple filter
    const { field, operator, value } = filter;
    const featureValue = feature.properties?.[field];

    switch (operator) {
      case 'eq':
        return featureValue === value;
      case 'neq':
        return featureValue !== value;
      case 'gt':
        return featureValue > value;
      case 'gte':
        return featureValue >= value;
      case 'lt':
        return featureValue < value;
      case 'lte':
        return featureValue <= value;
      case 'in':
        return value.includes(featureValue);
      case 'notin':
        return !value.includes(featureValue);
      default:
        return false;
    }
  }
};

/** Objects represent a map layer */
export class Layer implements LayerModel {
  // Map layer
  private layer: L.Layer | null = null;

  // Global properties for the layer
  public id!: string;
  public name!: string;
  public type!: LayerType;

  // Visibility
  public visibility!: boolean;
  public opacity!: number;

  // Layer Definition
  public layerDefinition?: LayerDefinition;

  // Popup info
  public popupInfo: PopupInfo = {
    title: '',
    description: '',
    popupElements: [],
  };
  public createdAt!: Date;
  public updatedAt!: Date;

  // Properties for the layer, if layer type is 'group'
  public sublayers: Layer[] = [];

  // Layer datasource
  public datasource?: LayerDatasource;
  public geojson: GeoJSON | null = null;
  // private properties: any | null = null;
  private filter: LayerFilter | null = null;
  // private styling: any | null = null;
  // private label: LayerLabel | null = null;

  // Layer fields, extracted from geojson
  private fields: { [key in string]: FieldTypes } = {};

  /**
   * Apply options to a layer
   *
   * @param map current map
   * @param layer layer to edit
   * @param options options to apply
   * @param iconProperties custom icon properties
   */
  public static applyOptionsToLayer(
    map: L.Map,
    layer: any,
    options: any,
    iconProperties?: any
  ) {
    if (layer?.children) {
      this.applyOptionsToLayer(map, layer.children, options);
    } else {
      const layers = get(layer, '_layers', [layer]);
      for (const layerKey in layers) {
        if (layers[layerKey]) {
          if (iconProperties && layers[layerKey] instanceof L.Marker) {
            const icon = createCustomDivIcon({
              icon: iconProperties.style,
              color: iconProperties.color || DEFAULT_MARKER_ICON_OPTIONS.color,
              size: iconProperties.size || DEFAULT_MARKER_ICON_OPTIONS.size,
              opacity: options.opacity || DEFAULT_MARKER_ICON_OPTIONS.opacity,
            });
            layers[layerKey].setIcon(icon);
            layers[layerKey].options = {
              ...layers[layerKey].options,
              ...options,
            };
          } else {
            layers[layerKey].setStyle(options);
          }
          map.removeLayer(layers[layerKey]);
          if (
            layers[layerKey].options.visibility &&
            !(
              map.getZoom() > layers[layerKey].options.maxZoom ||
              map.getZoom() < layers[layerKey].options.minZoom
            )
          ) {
            map.addLayer(layers[layerKey]);
          }
        }
      }
    }
  }

  /** @returns the children of the current layer */
  public getChildren() {
    return this.sublayers;
  }

  /** @returns the filtered geojson data */
  get data(): GeoJSON {
    if (!this.geojson) return EMPTY_FEATURE_COLLECTION;

    // If no filter is set, return the geojson data
    if (!this.filter) return this.geojson;

    // If the geojson is a feature, return it if it satisfies the filter
    // if not, return an empty feature collection
    if (this.geojson.type === 'Feature') {
      return featureSatisfiesFilter(this.geojson, this.filter)
        ? this.geojson
        : EMPTY_FEATURE_COLLECTION;
    }

    // If the geojson is a feature collection, return a new feature collection
    // with the features that satisfy the filter
    if (this.geojson.type === 'FeatureCollection') {
      return {
        type: 'FeatureCollection',
        features: this.geojson.features.filter((feature) =>
          this.filter ? featureSatisfiesFilter(feature, this.filter) : true
        ),
      };
    }

    // If geojson is a geometry, return an empty feature collection
    // @AntoineRelief is this correct? Or should we not filter geometry?
    return EMPTY_FEATURE_COLLECTION;
  }

  /**
   * Constructor for the Layer class
   *
   * @param options Layer options
   * @param popupService Popup service
   */
  constructor(options: any, private popupService: SafeMapPopupService) {
    if (options) {
      this.setConfig(options);
    } else {
      throw 'No settings provided';
    }
  }

  /**
   * Set config
   *
   * @param options Layer options
   */
  public setConfig(options: any) {
    this.id = get(options, 'id', '');
    this.name = get(options, 'name', '');
    this.type = get<LayerType>(options, 'type', 'FeatureLayer');
    this.opacity = get(options, 'opacity', 1);

    if (options.type !== 'group') {
      // Not group layer, add other properties
      this.datasource = get(options, 'datasource', null);
      this.geojson = get(options, 'geojson', EMPTY_FEATURE_COLLECTION);
      // this.properties = options.properties || DEFAULT_LAYER_PROPERTIES;
      this.filter = get(options, 'filter', DEFAULT_LAYER_FILTER);
      // this.styling = options.styling || [];
      // this.label = options.labels || null;
      this.layerDefinition = get(options, 'layerDefinition');
      this.popupInfo = get(options, 'popupInfo');
      this.setFields();
    } else if (options.sublayers) {
      // Group layer, add sublayers
      this.sublayers = options.sublayers?.map((child: any) => ({
        object: new Layer(child, this.popupService),
      }));
    }
  }

  /** Populates the fields array from the input */
  private setFields() {
    const geojson = this.data;
    const fields = this.fields;
    // If the geojson is a geometry, there are no fields to add
    // since it has not properties
    if (GEOMETRY_TYPES.includes(geojson.type)) return;

    const getFieldType = (field: string, value: any) => {
      let valueType: FieldTypes | null = null;
      if (typeof value === 'number') valueType = 'number';
      if (typeof value === 'boolean') valueType = 'boolean';
      if (typeof value === 'string') {
        // Check if the string is a date using regex ISO 8601
        const regex = new RegExp(
          '^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\\.[0-9]{3})?Z$'
        );
        if (regex.test(value)) valueType = 'date';
        else valueType = 'string';
      }

      // check if field already exists, and if it has the same value type
      return !valueType || (fields[field] && fields[field] !== valueType)
        ? 'any'
        : valueType;
    };

    // If the geojson is a feature, add the property fields to the fields object
    if (geojson.type === 'Feature') {
      Object.keys(geojson.properties ?? []).forEach((key) => {
        fields[key] = getFieldType(key, geojson.properties?.[key]);
      });
      return;
    }

    // If the geojson is a feature collection, do the same for each feature
    if (geojson.type === 'FeatureCollection') {
      geojson.features.forEach((feature) => {
        Object.keys(feature.properties ?? []).forEach((key) => {
          fields[key] = getFieldType(key, feature.properties?.[key]);
        });
      });
    }
  }

  /**
   * Gets the style for a feature
   * If no style is found, returns the default style
   *
   * @param feature Feature to get the style for
   * @returns the style for the feature
   */
  // private getFeatureStyle(feature: Feature<Geometry>): Required<LayerStyle> {
  // if the feature has a style property, use it
  // const featureStyle = feature.properties?.style;
  // if (featureStyle) return { ...DEFAULT_LAYER_STYLE, ...featureStyle };

  // const style = this.styling?.find(
  //   (s: any) => featureSatisfiesFilter(feature, s.filter) && s.style
  // );

  // // If no style is found, return the default style
  // return style?.style
  //   ? { ...DEFAULT_LAYER_STYLE, ...style?.style }
  //   : DEFAULT_LAYER_STYLE;
  // }

  /**
   * Get leaflet layer from layer definition
   *
   * @param redraw wether the layer should be redrawn
   * @returns the leaflet layer from layer definition
   */
  public getLayer(redraw?: boolean): L.Layer {
    // If layer has already been created, return it
    if (this.layer && !redraw) return this.layer;

    // data is the filtered geojson
    const data = this.data;

    const symbol: LayerSymbol = {
      style: get(
        this.layerDefinition,
        'drawingInfo.renderer.symbol.style',
        'location-dot'
      ),
      color: get(
        this.layerDefinition,
        'drawingInfo.renderer.symbol.color',
        'blue'
      ),
      size: get(this.layerDefinition, 'drawingInfo.renderer.symbol.size', 24),
    };

    const rendererType = get(
      this.layerDefinition,
      'drawingInfo.renderer.type',
      'simple'
    );

    const uniqueValueInfos = get(
      this.layerDefinition,
      'drawingInfo.renderer.uniqueValueInfos',
      []
    );

    const uniqueValueField = get(
      this.layerDefinition,
      'drawingInfo.renderer.field1',
      ''
    );

    const uniqueValueDefaultSymbol = get(
      this.layerDefinition,
      'drawingInfo.renderer.defaultSymbol',
      symbol
    );

    console.log(this.layerDefinition?.drawingInfo?.renderer);

    // options used for parsing geojson to leaflet layer
    const geoJSONopts: L.GeoJSONOptions<any> = {
      pointToLayer: (feature, latlng) => {
        if (rendererType === 'uniqueValue') {
          console.log(feature);
          const fieldValue = get(
            feature,
            `properties.${uniqueValueField}`,
            null
          );
          console.log(fieldValue);
          const uniqueValueSymbol =
            uniqueValueInfos.find((x) => x.value === fieldValue)?.symbol ||
            uniqueValueDefaultSymbol;
          console.log(uniqueValueSymbol);
          return new L.Marker(latlng).setIcon(
            createCustomDivIcon({
              icon: uniqueValueSymbol.style,
              color: uniqueValueSymbol.color,
              size: uniqueValueSymbol.size,
              opacity: this.opacity,
            })
          );
        } else {
          return new L.Marker(latlng).setIcon(
            createCustomDivIcon({
              icon: symbol.style,
              color: symbol.color,
              size: symbol.size,
              opacity: this.opacity,
            })
          );
        }
      },
      onEachFeature: (feature: Feature<any>, layer: L.Layer) => {
        // Add popup on click because we destroy popup component each time we remove it
        // In order to destroy all event subscriptions and avoid memory leak
        layer.addEventListener('click', () => {
          const coordinates = {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
          };
          // bind this to the popup service
          this.popupService.setPopUp(
            [feature],
            coordinates,
            this.popupInfo,
            layer
          );
        });
      },
      // style: (feature: Feature<Geometry> | undefined) => {
      //   if (!feature) return {};
      //   // const style = this.getFeatureStyle(feature);

      //   return {
      //     // fillColor: style.symbol.color,
      //     // fillOpacity: style.fillOpacity,
      //     // color: style.borderColor,
      //     // opacity: style.borderOpacity,
      //     // weight: style.borderWidth,
      //   };
      // },
    };

    switch (this.type) {
      case 'GroupLayer':
        this.sublayers.forEach((child) => (child.layer = child.getLayer()));
        const layers = this.sublayers
          .map((child) => child.layer)
          .filter((layer) => layer !== undefined) as L.Layer[];
        const layer = L.layerGroup(layers);
        layer.onAdd = (map: L.Map) => {
          const l = L.LayerGroup.prototype.onAdd.call(layer, map);
          // Leaflet.heat doesn't support click events, so we have to do it ourselves
          this.onAddLayer(map, layer);
          return l;
        };
        layer.onRemove = (map: L.Map) => {
          const l = L.LayerGroup.prototype.onRemove.call(layer, map);
          this.onRemoveLayer(map, layer);
          return l;
        };
        this.layer = layer;
        return this.layer;

      default:
        switch (
          get(this.layerDefinition, 'drawingInfo.renderer.type', 'simple')
        ) {
          case 'heatmap':
            // check data type
            if (data.type !== 'FeatureCollection')
              throw new Error(
                'Impossible to create a heatmap from this data, geojson type is not FeatureCollection'
              );
            const heatArray: any[] = [];

            data.features.forEach((feature: any) => {
              console.log(feature);
              switch (get(feature, 'type')) {
                case 'Point': {
                  heatArray.push([
                    get(feature, 'coordinates[1]'), // lat
                    get(feature, 'coordinates[0]'), // long
                  ]);
                  break;
                }
                case 'Feature': {
                  heatArray.push([
                    get(feature, 'geometry.coordinates[1]'), // lat
                    get(feature, 'geometry.coordinates[0]'), // long
                  ]);
                  break;
                }
                default: {
                  break;
                }
              }
            });

            const gradient = get(
              this.layerDefinition,
              'drawingInfo.renderer.gradient',
              DEFAULT_HEATMAP.gradient
            );

            const heatmapOptions: L.HeatMapOptions = {
              blur: get(
                this.layerDefinition,
                'drawingInfo.renderer.blur',
                DEFAULT_HEATMAP.blur
              ),
              radius: get(
                this.layerDefinition,
                'drawingInfo.renderer.radius',
                DEFAULT_HEATMAP.radius
              ),
              minOpacity: get(
                this.layerDefinition,
                'drawingInfo.renderer.minOpacity',
                DEFAULT_HEATMAP.minOpacity
              ),
              gradient: Object.keys(gradient).reduce((g, key) => {
                const stop = get(gradient, key);
                set(g, stop.ratio, stop.color);
                return g;
              }, {}),
            };

            console.log(heatArray);

            const layer = L.heatLayer(heatArray, heatmapOptions);

            console.log(layer);

            layer.onAdd = (map: L.Map) => {
              // So we can use onAdd method from HeatLayer class
              const l = (L as any).HeatLayer.prototype.onAdd.call(layer, map);
              // Leaflet.heat doesn't support click events, so we have to do it ourselves
              map.on('click', (event: any) => {
                const layerClass = event.originalEvent.target?.className;
                // We are setting the click event in the whole map, so in order to trigger the popup for heatmap we filter the target from the heatmap
                if (
                  typeof layerClass === 'string' &&
                  layerClass?.includes('heatmap')
                ) {
                  const zoom = map.getZoom();
                  const radius = 1000 / zoom;
                  const coordinates = {
                    lat: event.latlng.lat,
                    lng: event.latlng.lng,
                  };
                  // checks if the point is within the calculate radius
                  const matchedPoints = data.features.filter((feature) => {
                    if (
                      feature.type === 'Feature' &&
                      feature.geometry.type === 'Point'
                    ) {
                      const pointData = [
                        feature.geometry.coordinates[1],
                        feature.geometry.coordinates[0],
                        get(feature, 'properties.weight', 1),
                      ];
                      const distance = haversineDistance(
                        event.latlng.lat,
                        event.latlng.lng,
                        pointData[0],
                        pointData[1]
                      );
                      return distance < radius;
                    } else return false;
                  });

                  this.popupService.setPopUp(
                    matchedPoints,
                    coordinates,
                    this.popupInfo
                  );
                }
              });
              this.onAddLayer(map, layer);
              return l;
            };
            layer.onRemove = (map: L.Map) => {
              const l = (L as any).HeatLayer.prototype.onRemove.call(
                layer,
                map
              );
              this.onRemoveLayer(map, layer);
              return l;
            };
            this.layer = layer;
            return this.layer;
          default:
            switch (get(this.layerDefinition, 'featureReduction.type')) {
              case 'cluster':
                const clusterSymbol: LayerSymbol = get(
                  this.layerDefinition,
                  'featureReduction.drawingInfo.renderer.symbol',
                  symbol
                );
                const clusterGroup = L.markerClusterGroup({
                  maxClusterRadius: get(
                    this.layerDefinition,
                    'featureReduction.clusterRadius',
                    80
                  ),
                  zoomToBoundsOnClick: false,
                  iconCreateFunction: (cluster) => {
                    const htmlTemplate = document.createElement('label');
                    htmlTemplate.textContent = cluster
                      .getChildCount()
                      .toString();
                    return createCustomDivIcon(
                      {
                        icon: clusterSymbol.style,
                        color: clusterSymbol.color,
                        size:
                          (cluster.getChildCount() / 50) *
                            (MAX_CLUSTER_SIZE - MIN_CLUSTER_SIZE) +
                          MIN_CLUSTER_SIZE,
                        opacity: this.opacity,
                      },
                      htmlTemplate,
                      'leaflet-data-marker'
                    );
                  },
                });
                clusterGroup.onAdd = (map: L.Map) => {
                  const l = L.MarkerClusterGroup.prototype.onAdd.call(
                    clusterGroup,
                    map
                  );
                  this.onAddLayer(map, clusterGroup);
                  return l;
                };
                clusterGroup.onRemove = (map: L.Map) => {
                  const l = L.MarkerClusterGroup.prototype.onRemove.call(
                    clusterGroup,
                    map
                  );
                  this.onRemoveLayer(map, clusterGroup);
                  return l;
                };

                // Set popup for all the cluster markers
                clusterGroup.on('clusterclick', (event: any) => {
                  const coordinates = {
                    lat: event.latlng.lat,
                    lng: event.latlng.lng,
                  };
                  const children = event.layer
                    .getAllChildMarkers()
                    .map((child: L.Marker) => child.feature);
                  this.popupService.setPopUp(
                    children,
                    coordinates,
                    this.popupInfo,
                    event.layer
                  );
                });

                const clusterLayer = L.geoJSON(data, geoJSONopts);
                clusterLayer.onAdd = (map: L.Map) => {
                  const l = L.GeoJSON.prototype.onAdd.call(clusterLayer, map);
                  this.onAddLayer(map, clusterLayer);
                  return l;
                };
                clusterLayer.onRemove = (map: L.Map) => {
                  const l = L.GeoJSON.prototype.onRemove.call(layer, map);
                  this.onRemoveLayer(map, clusterLayer);
                  return l;
                };
                clusterGroup.addLayer(clusterLayer);
                this.layer = clusterGroup;
                return this.layer;
              default:
                const layer = L.geoJSON(data, geoJSONopts);

                layer.onAdd = (map: L.Map) => {
                  const l = L.GeoJSON.prototype.onAdd.call(layer, map);
                  this.onAddLayer(map, layer);
                  return l;
                };
                layer.onRemove = (map: L.Map) => {
                  const l = L.GeoJSON.prototype.onRemove.call(layer, map);
                  this.onRemoveLayer(map, layer);
                  return l;
                };
                this.layer = layer;
                return this.layer;
            }
        }
    }
  }

  /**
   * Handle layer addition, to subscribe to map event:
   * - set visibility based on zoom.
   * - add legend if any
   *
   * @param map Leaflet map
   * @param layer leaflet layer
   */
  onAddLayer(map: L.Map, layer: L.Layer) {
    const maxZoom = this.layerDefinition?.maxZoom || map.getMaxZoom();
    const minZoom = this.layerDefinition?.minZoom || map.getMinZoom();
    if (map.getZoom() > maxZoom || map.getZoom() < minZoom) {
      map.removeLayer(layer);
    } else {
      map.addLayer(layer);
      const legendControl = (map as any).legendControl;
      if (legendControl) {
        legendControl.addLayer(layer, this.legend);
      }
    }
    map.on('zoomend', (zoom) => {
      const currZoom = zoom.target.getZoom();
      const maxZoom = this.layerDefinition?.maxZoom || map.getMaxZoom();
      const minZoom = this.layerDefinition?.minZoom || map.getMinZoom();
      if (currZoom > maxZoom || currZoom < minZoom) {
        map.removeLayer(layer);
      } else {
        map.addLayer(layer);
      }
    });
  }

  /**
   * Handle layer deletion, to subscribe to map event:
   * - remove legend if any
   *
   * @param map Leaflet map
   * @param layer Leaflet layer
   */
  onRemoveLayer(map: L.Map, layer: L.Layer) {
    const legendControl = (map as any).legendControl;
    if (legendControl) {
      legendControl.removeLayer(layer);
    }
  }

  /**
   * Get legend from layer
   *
   * @returns layer legend as html
   */
  get legend() {
    let html = '';
    switch (this.type) {
      case 'FeatureLayer': {
        switch (
          get(this.layerDefinition, 'drawingInfo.renderer.type', 'simple')
        ) {
          case 'heatmap':
            const gradient = get(
              this.layerDefinition,
              'drawingInfo.renderer.gradient',
              DEFAULT_HEATMAP.gradient
            );
            const gradientPipe = new GradientPipe();
            const container = document.createElement('div');
            container.className = 'flex gap-1';
            const linearGradient = document.createElement('div');
            linearGradient.className = 'w-4 h-16';
            linearGradient.style.background = gradientPipe.transform(
              gradient,
              180
            );
            const legend = document.createElement('div');
            legend.className = 'flex flex-col justify-between';
            legend.innerHTML = '<span>Min</span><span>Max</span>';
            container.innerHTML = linearGradient.outerHTML + legend.outerHTML;
            html = container.outerHTML;
            break;
          case 'uniqueValue': {
            const defaultSymbol: LayerSymbol | undefined = get(
              this.layerDefinition,
              'drawingInfo.renderer.defaultSymbol'
            );
            const pipe = new SafeIconDisplayPipe();
            for (const info of get(
              this.layerDefinition,
              'drawingInfo.renderer.uniqueValueInfos',
              []
            )) {
              const symbol: LayerSymbol = info.symbol;
              html += `<span class="flex gap-2 items-center"><i style="color: ${
                symbol.color
              }"; class="${pipe.transform(symbol.style, 'fa')} pl-2"></i>${
                info.label
              }</span>`;
            }
            if (defaultSymbol) {
              html += `<span class="flex gap-2 items-center"><i style="color: ${
                defaultSymbol.color
              }"; class="${pipe.transform(
                defaultSymbol.style,
                'fa'
              )} pl-2"></i>${get(
                this.layerDefinition,
                'drawingInfo.renderer.defaultLabel'
              )}</span>`;
            }

            break;
          }
          default: {
            const symbol: LayerSymbol = {
              style: get(
                this.layerDefinition,
                'drawingInfo.renderer.symbol.style',
                'location-dot'
              ),
              color: get(
                this.layerDefinition,
                'drawingInfo.renderer.symbol.color',
                'blue'
              ),
              size: get(
                this.layerDefinition,
                'drawingInfo.renderer.symbol.size',
                24
              ),
            };
            const pipe = new SafeIconDisplayPipe();
            html += `<i style="color: ${symbol.color}"; class="${pipe.transform(
              symbol.style,
              'fa'
            )} pl-2"></i>`;
            break;
          }
        }
        switch (get(this.layerDefinition, 'featureReduction.type')) {
          case 'cluster': {
            // Features legend
            const symbol: LayerSymbol = {
              style: get(
                this.layerDefinition,
                'drawingInfo.renderer.symbol.style',
                'location-dot'
              ),
              color: get(
                this.layerDefinition,
                'drawingInfo.renderer.symbol.color',
                'blue'
              ),
              size: get(
                this.layerDefinition,
                'drawingInfo.renderer.symbol.size',
                24
              ),
            };
            const pipe = new SafeIconDisplayPipe();
            // Cluster legend
            const clusterSymbol: LayerSymbol = get(
              this.layerDefinition,
              'featureReduction.drawingInfo.renderer.symbol',
              symbol
            );
            html += `<div>Clusters</div>`;
            html += `<i style="color: ${
              clusterSymbol.color
            }"; class="${pipe.transform(clusterSymbol.style, 'fa')} pl-2"></i>`;
            break;
          }
          default: {
            break;
          }
        }
        break;
      }
      case 'GroupLayer': {
        break;
      }
    }
    if (html) {
      html = `<div class="font-bold">${this.name}</div>` + html;
    }
    return html;
  }
}
