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

/**
 * Backend layer model
 */
export interface LayerModel {
  id: string;
  name: string;
  sublayers?: LayerModel[];
  visibility: boolean;
  opacity: boolean;
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
          icon?: IconName | 'location-dot';
        };
      };
    };
  };
  popupInfo: {
    popupElements: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
