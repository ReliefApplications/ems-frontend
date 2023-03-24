import { IconName } from '../components/icon-picker/icon-picker.const';
/** List of available layer types in layer editor */
export enum LayerTypes {
  POLYGON = 'polygon',
  POINT = 'point',
  HEATMAP = 'heatmap',
  CLUSTER = 'cluster',
}
/**
 * Layer types as an array of values
 */
export const LAYER_TYPES: LayerTypes[] = Object.values(LayerTypes);

/**
 * Layer types for backend
 */
export enum BackendLayerTypes {
  FEATURE_LAYER = 'FeatureLayer',
}

/** Layer documents interface declaration */
export interface Layer {
  id: string;
  title: string;
  visibility: boolean;
  createdAt?: Date;
  modifiedAt?: Date;
  layerDefinition?: {
    minZoom?: number;
    maxZoom?: number;
    featureReduction?: any;
    // Symbol
    drawingInfo?: {
      renderer?: {
        type?: string;
        symbol?: {
          color?: string;
          size?: number;
          icon?: IconName | 'leaflet_default';
        };
      };
    };
  };
  opacity: number;
  // Layer datasource
  datasource: {
    origin: any;
    resource: any;
    layout: any;
    aggregation: any;
    refData: any;
  };
  popupInfo?: {
    popupElements?: any[];
    title?: string;
  };
}
