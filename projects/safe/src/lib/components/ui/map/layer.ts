import * as L from 'leaflet';
import {
  LayerSettingsI,
  LayerType,
  LayerProperties,
  LayerFilter,
  LayerStyling,
  LayerLabel,
  LayerPopup,
  GeoJSON,
  FeatureProperties,
  LayerStyle,
} from './interfaces/layer-settings.type';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { createCustomMarker } from './utils/create-marker';
import { get } from 'lodash';
import { generateIconHTML } from './utils/generateIcon';
import { IconName } from './const/fa-icons';
import { createCustomDivIcon } from './utils/create-div-icon';

type FieldTypes = 'string' | 'number' | 'boolean' | 'date' | 'any';

/** GeoJSON with no features */
export const EMPTY_FEATURE_COLLECTION: GeoJSON = {
  type: 'FeatureCollection',
  features: [],
};

/** Default layer properties */
export const DEFAULT_LAYER_PROPERTIES: LayerProperties = {
  visibilityRange: [1, 18],
  opacity: 1,
  visibleByDefault: true,
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
  icon: 'leaflet_default',

  // icon?: string;
  // iconSize?: number;

  // };
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
  feature: Feature<Geometry, FeatureProperties>,
  filter: LayerFilter
): boolean => {
  // Check if the filter is a simple filter
  if ('filters' in filter) {
    const op = filter.condition === 'and' ? 'every' : 'some';
    return filter.filters[op]((f) => featureSatisfiesFilter(feature, f));
  } else {
    // Filter is a simple filter
    const { field, operator, value } = filter;
    const featureValue = feature.properties[field];

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
  private name: string;
  private type: LayerType;

  // Properties for the layer, if layer type is 'group'
  private children: Layer[] | null = null;

  // Properties for the layer, if layer type is not 'group'
  private datasource: any | null = null; // TODO: define datasource
  private geojson: GeoJSON | null = null;
  private properties: LayerProperties | null = null;
  private filter: LayerFilter | null = null;
  private styling: LayerStyling | null = null;
  private label: LayerLabel | null = null;
  private popup: LayerPopup | null = null; // TODO: define popup

  // Layer fields, extracted from geojson
  private fields: { [key in string]: FieldTypes } = {};

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
   * @param settings The settings for the layer
   */
  constructor(settings: LayerSettingsI) {
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
      this.children = settings.children?.map((child) => new Layer(child));
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
      Object.keys(geojson.properties).forEach((key) => {
        fields[key] = getFieldType(key, geojson.properties[key]);
      });
      return;
    }

    // If the geojson is a feature collection, do the same for each feature
    if (geojson.type === 'FeatureCollection') {
      geojson.features.forEach((feature) => {
        Object.keys(feature.properties).forEach((key) => {
          fields[key] = getFieldType(key, feature.properties[key]);
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
  private getFeatureStyle(
    feature: Feature<Geometry, FeatureProperties>
  ): Required<LayerStyle> {
    const style = this.styling?.find(
      (s) => featureSatisfiesFilter(feature, s.filter) && s.style
    );

    return style?.style
      ? { ...DEFAULT_LAYER_STYLE, ...style?.style }
      : DEFAULT_LAYER_STYLE;
  }

  /** @returns the leaflet layer from layer definition */
  public getLayer(): L.Layer | null {
    const data = this.data;
    let style: Required<LayerStyle> = DEFAULT_LAYER_STYLE;

    const firstStyle = this.styling?.[0]?.style
      ? { ...DEFAULT_LAYER_STYLE, ...this.styling[0].style }
      : DEFAULT_LAYER_STYLE;

    const geoJSONopts = {
      // Circles are not supported by geojson
      // We abstract them as markers with a radius property
      pointToLayer: (
        feature: Feature<Geometry, FeatureProperties>,
        latlng: L.LatLng
      ) => {
        const { style: featureStyle } = feature.properties;

        // Priority: feature style > layer style > default style
        style = featureStyle
          ? { ...DEFAULT_LAYER_STYLE, ...featureStyle }
          : this.getFeatureStyle(feature);

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
        } else {
          const marker = new L.Marker(latlng);
          if (style.icon !== 'leaflet_default') {
            const size = style.iconSize;

            // Custom fontawesome icon
            const icon = L.divIcon({
              className: 'custom-marker',
              iconSize: [size, size],
              iconAnchor: [size / 2, size / 2],
              popupAnchor: [size / 2, -36],
              html: generateIconHTML({
                icon: style.icon as IconName,
                color: style.fillColor,
                size,
              }),
            });

            marker.setIcon(icon);
          } else {
            // If no icon is specified, use the default marker
            const icon = createCustomMarker(style.fillColor, style.fillOpacity);
            marker.setIcon(icon);
          }

          return marker;
        }
      },
      style: (feature: Feature<Geometry, FeatureProperties> | undefined) => {
        if (!feature) return {};
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
        if (!this.children) return null;
        const layers = this.children
          .map((child) => child.getLayer())
          .filter((layer) => layer !== null);

        return new L.LayerGroup(layers as L.Layer[]);

      case 'sketch':
      case 'feature':
        return L.geoJSON(data, geoJSONopts);

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
              icon: firstStyle.icon as IconName | 'leaflet_default',
              color: firstStyle.fillColor,
              size:
                (cluster.getChildCount() / 50) *
                  (MAX_CLUSTER_SIZE - MIN_CLUSTER_SIZE) +
                MIN_CLUSTER_SIZE,
            };
            const htmlTemplate = `<p>${cluster.getChildCount()}</p>`;
            return createCustomDivIcon(
              iconProperties,
              undefined,
              htmlTemplate,
              'leaflet-data-marker'
            );
          },
        });
        const clusterLayer = L.geoJSON(data, geoJSONopts);
        clusterGroup.addLayer(clusterLayer);
        return clusterGroup;

      case 'heatmap':
        // check data type
        if (data.type !== 'FeatureCollection')
          throw new Error(
            'Impossible to create a heatmap from this data, geojson type is not FeatureCollection'
          );
        const heatArray: any[] = [];
        const collection: FeatureCollection<Geometry, FeatureProperties> = data;

        collection.features.forEach((feature) => {
          if (feature.geometry.type === 'Point') {
            heatArray.push([
              feature.geometry.coordinates[1], // lat
              feature.geometry.coordinates[0], // long
            ]);
          }
        });

        return L.heatLayer(heatArray, firstStyle.heatmap);
    }

    // Check for icon property
  }

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
    if (layer.children) {
      this.applyOptionsToLayer(map, layer.children, options);
    } else {
      const layers = get(layer, '_layers', [layer]);
      for (const layerKey in layers) {
        if (layers[layerKey]) {
          if (icon && layers[layerKey] instanceof L.Marker) {
            layers[layerKey].setIcon(icon);
          } else {
            layers[layerKey].setStyle(options);
          }
          map.removeLayer(layers[layerKey]);
          if (
            (layers[layerKey].options.visible ||
              layers[layerKey] instanceof L.Marker) &&
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
}
