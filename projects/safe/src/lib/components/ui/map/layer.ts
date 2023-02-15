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
} from './interfaces/layer-settings.type';
import { Feature, Geometry } from 'geojson';

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
const FeatureSatisfiesFilter = (
  feature: Feature<Geometry, FeatureProperties>,
  filter: LayerFilter
): boolean => {
  // Check if the filter is a simple filter
  if ('filters' in filter) {
    const op = filter.condition === 'and' ? 'every' : 'some';
    return filter.filters[op]((f) => FeatureSatisfiesFilter(feature, f));
  } else {
    // Filter is a simple filter
    const { field, operator, value } = filter;
    const featureValue = feature.properties[field];

    switch (operator) {
      // Todo check for fields type and add other operators
      case 'eq':
        return featureValue === value;
      case 'neq':
        return featureValue !== value;
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
      return FeatureSatisfiesFilter(this.geojson, this.filter)
        ? this.geojson
        : EMPTY_FEATURE_COLLECTION;
    }

    // If the geojson is a feature collection, return a new feature collection
    // with the features that satisfy the filter
    if (this.geojson.type === 'FeatureCollection') {
      return {
        type: 'FeatureCollection',
        features: this.geojson.features.filter((feature) =>
          this.filter ? FeatureSatisfiesFilter(feature, this.filter) : true
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

  /** @returns the leaflet layer from layer definition */
  public getLayer(): L.Layer | null {
    // ... TODO: create layer
    return null;
  }
}
