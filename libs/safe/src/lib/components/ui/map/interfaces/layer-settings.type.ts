import { Geometry, FeatureCollection, Feature } from 'geojson';
import { IconName } from '../../../icon-picker/icon-picker.const';
import { popupElement } from '../../../widgets/map-settings/map-layer/layer-popup/layer-popup.interface';

export type GeoJSON =
  | Geometry
  | Feature<Geometry>
  | FeatureCollection<Geometry>;

// Assuming that data will be a valid geoJSON object,
// the layer types are defined as follows:
export type LayerType = 'feature' | 'heatmap' | 'cluster' | 'sketch' | 'group';

export type GeometryTypes = 'Point' | 'Polygon' | 'LineString';
// The 'feature' layer type would display in the layer all the features
// in the geoJSON object. Points would be displayed as markers, unless
// they have the radius property, in which case they would be displayed
// as circles.

// The 'heatmap' layer type would display a heatmap of the points in the
// geoJSON object. All other features would be ignored.

// The 'cluster' layer type would display a cluster of the points in the
// geoJSON object. All other features would be ignored.

// The 'sketch' type indicates that the layer is a sketch layer.
// it works like a 'feature' layer, but also allows the user to draw
// new features on the map.

// The 'group' layer type would display a group of layers.
// It has no other properties besides the name and children.

// The layer type has always a name and type property.
// The other properties depend on the layer type.
export type LayerSettingsI = {
  name: string;
  id: string;
} & (LayerNode | LayerGroup);

// The group layer has a children property, which is an array of layers.
type LayerGroup = {
  type: 'group';
  children: LayerSettingsI[];
};

type LayerNode = {
  type: Omit<LayerType, 'group'>;
  geojson?: GeoJSON;
  // TODO: define datasource
  datasource?: any;
  properties?: any;
  filter?: LayerFilter;
  // Not all styles are valid for all layer types but for simplicity,
  // if if a layer has an invalid style, it will simply be ignored
  styling?: any;
  labels?: LayerLabel;
  popup?: any;
};

/** Layer documents interface declaration */
export interface LayerProperties {
  id: string;
  name: string;
  visibility: boolean;
  opacity: number;
  layerDefinition: {
    minZoom: number;
    maxZoom: number;
    drawingInfo: {
      renderer: {
        type: 'simple' | 'heatmap';
        symbol: {
          color: string;
          type: string;
          size: number;
          style: IconName;
        };
      };
    };
    featureReduction: {
      type: any;
    };
  };
  popupInfo: {
    title: string;
    description: string;
    popupElements: popupElement[];
  };
  datasource: {
    origin: 'resource' | 'refData';
    resource: any;
    layout: any;
    aggregation: any;
    refData: any;
  };
}

// The style object is defined as follows:
export type LayerStyle = {
  borderColor?: string;
  borderWidth?: number;
  borderOpacity?: number;
  // for markers, the fillColor represents marker color
  fillColor?: string;
  fillOpacity?: number;
  icon?: IconName | 'leaflet_default';
  iconSize?: number;

  heatmap?: {
    max: number;
    radius: number;
    blur: number;
    minOpacity: number;
    maxZoom: number;
    // The gradient is an object with keys from 0 to this.max
    gradient: {
      [key: number]: string;
    };
  };
};

export type LayerLabel = {
  // Defined as a string, can use placeholders, like {field.field_name}
  label: string;
  style: {
    color: string;
    fontSize: number;
    fontWeight: string;
  };
  filter: LayerFilter;
};

export type LayerFilter =
  | {
      condition: 'and' | 'or';
      filters: LayerFilter[];
    }
  | {
      field: string;
      // Operator will depend on the field type
      operator: string;
      value: any;
    };
