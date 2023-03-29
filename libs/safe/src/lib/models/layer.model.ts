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

export type LayerSymbol = {
  color: string;
  size: number;
  style: IconName;
};

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
      symbol?: LayerSymbol;
      blur?: number;
      radius?: number;
      gradient?: Gradient;
    };
  };
}

export interface PopupElementText {
  type: 'text';
  text?: string;
}

export interface PopupElementFields {
  type: 'fields';
  title?: string;
  description?: string;
  fields?: string[];
}

export type PopupElementType = 'text' | 'fields';

export interface PopupElement
  extends Omit<PopupElementText, 'type'>,
    Omit<PopupElementFields, 'type'> {
  type: PopupElementType;
}

/**
 * Backend layer model
 */
export interface LayerModel {
  id: string;
  name: string;
  sublayers?: LayerModel[];
  visibility: boolean;
  opacity: number;
  layerDefinition?: LayerDefinition;
  popupInfo?: {
    popupElements: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
