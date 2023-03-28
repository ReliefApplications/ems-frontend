import { Gradient } from '../components/gradient-picker/gradient-picker.component';
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

export interface LayerDefinition {
  minZoom?: number;
  maxZoom?: number;
  featureReduction?: {
    type?: string;
  };
  // Symbol
  drawingInfo?: {
    renderer?: {
      type?: string;
      symbol?: {
        color?: string;
        size?: number;
        icon?: IconName | 'location-dot';
      };
      blur?: number;
      radius?: number;
      gradient?: Gradient;
    };
  };
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
  layerDefinition?: LayerDefinition;
  popupInfo?: {
    popupElements: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
