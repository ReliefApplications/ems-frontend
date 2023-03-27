// Leaflet imports
import * as L from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';

import { Feature, FeatureCollection, Geometry } from 'geojson';
import { get } from 'lodash';
import {
  LayerType,
  LayerFilter,
  LayerLabel,
  GeoJSON,
  LayerStyle,
} from './interfaces/layer-settings.type';
import { IconName } from '../../icon-picker/icon-picker.const';
import { createCustomDivIcon } from './utils/create-div-icon';
import { LegendDefinition } from './interfaces/layer-legend.type';
import { SafeRestService } from '../../../services/rest/rest.service';
import {
  forkJoin,
  from,
  lastValueFrom,
  map,
  mergeMap,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import {
  GetLayersQueryResponse,
  GET_LAYERS,
} from '../../../services/map/graphql/queries';
import { Apollo } from 'apollo-angular';
import { LayerModel } from '../../../models/layer.model';

type FieldTypes = 'string' | 'number' | 'boolean' | 'date' | 'any';
type ChildLayer = { object: Layer; layer?: L.Layer };
interface MergedLayerInfo extends LayerModel {
  geojson: {
    features: any[];
    type: string;
  };
}
/** GeoJSON with no features */
export const EMPTY_FEATURE_COLLECTION: GeoJSON = {
  type: 'FeatureCollection',
  features: [],
};

/** Default layer properties */
export const DEFAULT_LAYER_PROPERTIES = {
  visibilityRange: [1, 18],
  opacity: 1,
  visibleByDefault: true,
  legend: {
    display: false,
  },
};

/** Default layer filter */
export const DEFAULT_LAYER_FILTER: LayerFilter = {
  condition: 'and',
  filters: [],
};

/** Default layer style */
export const DEFAULT_LAYER_STYLE = {
  // TODO: Get primary color from theme
  borderColor: '#0b55d6',
  fillColor: '#0b55d6',
  borderOpacity: 1,
  fillOpacity: 1,
  borderWidth: 2,
  iconSize: 20,
  heatmap: {
    gradient: {
      0: '#08d1d1',
      0.25: '#08d169',
      0.5: '#deba07',
      0.75: '#de6707',
      1: '#de0715',
    },
    max: 1.0,
    radius: 10,
    blur: 15,
    minOpacity: 0.5,
    maxZoom: 18,
  },
  icon: 'location-dot',
} as Required<LayerStyle>;

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
export class Layer {
  // Map layer
  private layer: L.Layer | null = null;

  // Global properties for the layer
  public name!: string;
  public type!: LayerType;

  // Properties for the layer, if layer type is 'group'
  private children: ChildLayer[] = [];

  // Properties for the layer, if layer type is not 'group'
  private datasource: any | null = null; // TODO: define datasource
  private geojson: GeoJSON | null = null;
  private properties: any | null = null;
  private filter: LayerFilter | null = null;
  private styling: any | null = null;
  private label: LayerLabel | null = null;
  private popup: any | null = null; // TODO: define popup

  // Layer fields, extracted from geojson
  private fields: { [key in string]: FieldTypes } = {};

  /**
   * Apply options to a layer
   *
   * @param map current map
   * @param layer layer to edit
   * @param options options to apply
   * @param icon custom icon
   */
  public static applyOptionsToLayer(
    map: L.Map,
    layer: any,
    options: any,
    icon?: any
  ) {
    if (layer?.children) {
      this.applyOptionsToLayer(map, layer.children, options);
    } else {
      const layers = get(layer, '_layers', [layer]);
      for (const layerKey in layers) {
        if (layers[layerKey]) {
          if (icon && layers[layerKey] instanceof L.Marker) {
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
            layers[layerKey].options.visible &&
            !(
              layers[layerKey].options.visibilityRange &&
              (map.getZoom() > options.visibilityRange[1] ||
                map.getZoom() < options.visibilityRange[0])
            )
          ) {
            map.addLayer(layers[layerKey]);
          }
        }
      }
    }
  }

  /**
   * Format given settings for Layer class
   *
   * @param layerIds layer settings saved from the layer editor
   * @param restService rest service to get the geojson
   * @param apollo Apollo
   * @returns Observable of LayerSettingsI
   */
  public static async createLayerFrom(
    layerIds: string[],
    restService: SafeRestService,
    apollo: Apollo
  ): Promise<Layer> {
    const formattedLayerSettings = await lastValueFrom(
      apollo
        .query<GetLayersQueryResponse>({
          query: GET_LAYERS,
        })
        .pipe(
          // Get the layer info from the layers where the id is included in the given layerIds
          switchMap((response) =>
            from(
              response.data.layers.filter((layer) =>
                layerIds.includes(layer.id)
              )
            )
          ),
          // Then go layer by layer to create the layerSettings object
          mergeMap((layerInfo: LayerModel) => {
            // Get the current layerInfo plus it's geojson
            return forkJoin({
              layer: of(layerInfo),
              geojson: restService.get(
                `${
                  restService.apiUrl
                }/gis/feature?type=Point&tolerance=${0.9}&highquality=${true}`
              ),
            });
          }),
          // Destructure layer information to have all data at the same level
          map(
            (mergedLayerInfo) =>
              ({
                ...mergedLayerInfo.layer,
                geojson: mergedLayerInfo.geojson,
              } as MergedLayerInfo)
          ),
          // Get them into an array after all pipes are done
          toArray(),
          // And set those layers into the children of our hardcoded layer group
          // @TODO it would be mapped later onto it's current layer type
          map((mergedLayerInfo: MergedLayerInfo[]) => {
            return {
              name: 'group layers',
              type: 'group',
              children: this.getLayerSettings(mergedLayerInfo),
            };
          })
        )
    );
    return new Layer(formattedLayerSettings);
  }

  /**
   * Set the geojson to the given layer settings
   *
   * @param mergedLayerInfo layer settings saved from the layer editor
   * @returns LayerSettingsI array
   */
  private static getLayerSettings(mergedLayerInfo: MergedLayerInfo[]): any[] {
    return mergedLayerInfo.map((layerInfo) =>
      // @TODO As we complete the layer editor we will have to set those new values in these function
      // instead of the hardcoded ones
      ({
        // Currently we only have name and id in the graphql endpoint for each layer metadata
        name: layerInfo.name,
        id: layerInfo.id,
        type: 'feature',
        // The geojson previously fetched from the REST
        geojson: layerInfo.geojson,
        filter: {
          condition: 'and',
          filters: [
            {
              filter: {
                condition: 'and',
                filters: [],
              },
              style: {
                borderColor: 'black',
                borderWidth: 1,
                fillOpacity: layerInfo.opacity ?? 1,
                borderOpacity: layerInfo.opacity ?? 1,
                fillColor:
                  layerInfo.layerDefinition?.drawingInfo?.renderer?.symbol
                    ?.color ?? 'purple',
                icon:
                  layerInfo.layerDefinition?.drawingInfo?.renderer?.symbol
                    ?.icon ?? 'location-dot',
                iconSize:
                  layerInfo.layerDefinition?.drawingInfo?.renderer?.symbol
                    ?.size ?? 24,
              },
            },
          ],
        },
        properties: {
          // None of this data is available yet
          visibilityRange: [
            layerInfo.layerDefinition?.minZoom ?? 2,
            layerInfo.layerDefinition?.maxZoom ?? 18,
          ],
          opacity: layerInfo?.opacity ?? 1,
          visibleByDefault: layerInfo.visibility ?? true,
          legend: {
            display: true,
            field: 'name',
          },
        },
        styling: [
          {
            filter: {
              condition: 'and',
              filters: [],
            },
            style: {
              borderColor: 'black',
              borderWidth: 1,
              fillOpacity: layerInfo.opacity ?? 1,
              borderOpacity: layerInfo.opacity ?? 1,
              fillColor:
                layerInfo.layerDefinition?.drawingInfo?.renderer?.symbol
                  ?.color ?? 'purple',
              icon:
                layerInfo.layerDefinition?.drawingInfo?.renderer?.symbol
                  ?.icon ?? 'leaflet_default',
              iconSize:
                layerInfo.layerDefinition?.drawingInfo?.renderer?.symbol
                  ?.size ?? 24,
            },
          },
        ],
        labels: {
          filter: {
            condition: 'and',
            filters: [],
          },
          label: '{{name}}',
          style: {
            color: '#000000',
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
      })
    );
  }

  /** @returns the children of the current layer */
  public getChildren() {
    return this.children;
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

  /** @returns the first style of the layer */
  get firstStyle() {
    return this.styling?.[0]?.style
      ? { ...DEFAULT_LAYER_STYLE, ...this.styling[0].style }
      : DEFAULT_LAYER_STYLE;
  }

  /**
   * Constructor for the Layer class
   *
   * @param settings The settings for the layer
   */
  constructor(settings: any) {
    if (settings) {
      this.setConfig(settings);
    } else {
      throw 'No settings provided';
    }
  }

  /**
   * Set config
   *
   * @param settings LayerSettings
   */
  private setConfig(settings: any) {
    this.name = settings.name;
    this.type = settings.type as LayerType;

    if (settings.type !== 'group') {
      // Not group layer, add other properties
      this.datasource = settings.datasource || null;
      this.geojson = settings.geojson || EMPTY_FEATURE_COLLECTION;
      this.properties = settings.properties || DEFAULT_LAYER_PROPERTIES;
      this.filter = settings.filter || DEFAULT_LAYER_FILTER;
      this.styling = settings.styling || [];
      this.label = settings.labels || null;
      this.popup = settings.popup || null;
      this.setFields();
    } else if (settings.children) {
      // Group layer, add children
      this.children = settings.children?.map((child: any) => ({
        object: new Layer(child),
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
  private getFeatureStyle(feature: Feature<Geometry>): Required<LayerStyle> {
    // if the feature has a style property, use it
    const featureStyle = feature.properties?.style;
    if (featureStyle) return { ...DEFAULT_LAYER_STYLE, ...featureStyle };

    const style = this.styling?.find(
      (s: any) => featureSatisfiesFilter(feature, s.filter) && s.style
    );

    // If no style is found, return the default style
    return style?.style
      ? { ...DEFAULT_LAYER_STYLE, ...style?.style }
      : DEFAULT_LAYER_STYLE;
  }

  /** @returns the leaflet layer from layer definition */
  public getLayer(): L.Layer {
    // If layer has already been created, return it
    if (this.layer) return this.layer;

    // data is the filtered geojson
    const data = this.data;

    // options used for parsing geojson to leaflet layer
    const geoJSONopts: L.GeoJSONOptions<any> = {
      pointToLayer: (feature, latlng) => {
        const style = this.getFeatureStyle(feature);

        // circles are not supported by geojson
        // we abstract them as markers with a radius property
        if (feature.properties.radius) {
          const circle = L.circle(latlng, feature.properties.radius);

          // Setting circle relevant style
          circle.setStyle({
            color: style.borderColor,
            fillColor: style.fillColor,
            fillOpacity: style.fillOpacity,
            opacity: style.borderOpacity,
            weight: style.borderWidth,
          });

          return circle;
        }

        // If not a circle, create a marker
        return new L.Marker(latlng).setIcon(
          createCustomDivIcon({
            icon: style.icon,
            color: style.fillColor,
            size: style.iconSize,
            opacity: style.fillOpacity,
          })
        );
      },
      style: (feature: Feature<Geometry> | undefined) => {
        if (!feature) return {};
        const style = this.getFeatureStyle(feature);

        return {
          fillColor: style.fillColor,
          fillOpacity: style.fillOpacity,
          color: style.borderColor,
          opacity: style.borderOpacity,
          weight: style.borderWidth,
        };
      },
    };

    switch (this.type) {
      case 'group':
        this.children.forEach(
          (child) => (child.layer = child.object.getLayer())
        );
        const layers = this.children
          .map((child) => child.layer)
          .filter((layer) => layer !== undefined) as L.Layer[];
        this.layer = new L.LayerGroup(layers);
        return this.layer;

      case 'sketch':
      case 'feature':
        this.layer = L.geoJSON(data, geoJSONopts);
        return this.layer;

      case 'cluster':
        // gets the first style of the styling array
        // would be nice to have it check that if every point
        // in the cluster satisfies the same filter, then it
        // uses that style for the entire cluster,
        // but I can't find a way to add properties to the clusters' points
        const clusterGroup = L.markerClusterGroup({
          zoomToBoundsOnClick: false,
          iconCreateFunction: (cluster) => {
            const iconProperties = {
              icon: this.firstStyle.icon as IconName | 'location-dot',
              color: this.firstStyle.fillColor,
              size:
                (cluster.getChildCount() / 50) *
                  (MAX_CLUSTER_SIZE - MIN_CLUSTER_SIZE) +
                MIN_CLUSTER_SIZE,
              opacity: this.firstStyle.fillOpacity,
            };
            // Use label as it's an inline element therefor does not take all available space
            const htmlTemplate = document.createElement('label'); // todo(gis): better labels
            htmlTemplate.textContent = cluster.getChildCount().toString();
            return createCustomDivIcon(
              iconProperties,
              htmlTemplate,
              'leaflet-data-marker'
            );
          },
        });
        const clusterLayer = L.geoJSON(data, geoJSONopts);
        clusterGroup.addLayer(clusterLayer);
        this.layer = clusterGroup;
        return this.layer;

      case 'heatmap':
        // check data type
        if (data.type !== 'FeatureCollection')
          throw new Error(
            'Impossible to create a heatmap from this data, geojson type is not FeatureCollection'
          );
        const heatArray: any[] = [];
        const collection: FeatureCollection<Geometry> = data;

        collection.features.forEach((feature) => {
          if (feature.geometry.type === 'Point') {
            heatArray.push([
              feature.geometry.coordinates[1], // lat
              feature.geometry.coordinates[0], // long
            ]);
          }
        });

        this.layer = L.heatLayer(heatArray, this.firstStyle.heatmap);
        return this.layer;
    }

    // Check for icon property
  }

  /**
   * Get the legend definition from the layer
   *
   * @returns the legend definition
   */
  public getLegend(): LegendDefinition | null {
    if (!this.properties?.legend || this.properties.legend.display === false)
      return null;

    const data = this.data;
    const labelField = this.properties.legend.field;

    switch (this.type) {
      case 'group':
        // Groups don't have legends
        return null;

      case 'sketch':
      case 'feature':
        // check if data is a FeatureCollection or a Feature
        const features =
          data.type === 'FeatureCollection' ? data.features : [data];

        const items: {
          label: string;
          color: string;
          icon?: IconName | 'location-dot';
        }[] = [];

        features.forEach((feature) => {
          if ('properties' in feature) {
            // check if feature is a point
            // @TODO structure sent from backend follows the feature.type structure
            const isPoint = feature.geometry?.type
              ? feature.geometry.type === 'Point'
              : (feature as any).type === 'Point';
            const style = this.getFeatureStyle(feature);
            items.push({
              label: labelField ? feature.properties?.[labelField] ?? '' : '',
              color: style.fillColor,
              icon: isPoint ? style.icon : undefined,
            });
          }
        });

        return {
          type: 'feature',
          items,
        };

      case 'cluster':
        return {
          type: 'cluster',
          color: this.firstStyle.fillColor,
          icon: this.firstStyle.icon,
          min: MIN_CLUSTER_SIZE,
          max: MAX_CLUSTER_SIZE,
        };
      case 'heatmap':
        // transform gradient to array of objects
        const gradient: { color: string; value: number }[] = [];
        Object.keys(this.firstStyle.heatmap.gradient).forEach((key) => {
          const nbr = parseFloat(key);
          gradient.push({
            color: this.firstStyle.heatmap.gradient[nbr],
            value: parseFloat(key),
          });
        });

        return {
          type: 'heatmap',
          gradient,
        };
    }
  }
}
