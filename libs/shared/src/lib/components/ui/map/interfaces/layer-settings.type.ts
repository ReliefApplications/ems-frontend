import { Geometry, FeatureCollection, Feature } from 'geojson';
import {
  Fields,
  LayerSymbolOutline,
  PopupElement,
} from '../../../../models/layer.model';
import { FaIconName } from '@oort-front/ui';

export type GeoJSON =
  | Geometry
  | Feature<Geometry>
  | FeatureCollection<Geometry>;

// Assuming that data will be a valid geoJSON object,
// the layer types are defined as follows:
export type LayerType = 'FeatureLayer' | 'GroupLayer';

export type GeometryType = 'Point' | 'Polygon';

/** Layer documents interface declaration */
export interface LayerFormData {
  id?: string;
  name: string;
  type: string;
  visibility: boolean;
  opacity: number;
  layerDefinition: {
    minZoom: number;
    maxZoom: number;
    drawingInfo: {
      renderer: {
        type: 'simple' | 'heatmap' | 'uniqueValue';
        symbol: {
          color: string;
          type: string;
          size: number;
          style: FaIconName;
          outline?: LayerSymbolOutline;
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
    popupElements: PopupElement[];
    fieldsInfo?: Fields[];
  };
  datasource?: {
    origin?: 'resource' | 'refData';
    resource: any;
    layout: any;
    aggregation: any;
    refData: any;
    type?: GeometryType;
  };
  sublayers?: string[];
  contextFilters: string;
  at: string;
}

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
