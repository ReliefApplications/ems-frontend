import { Gradient } from '../components/gradient-picker/gradient-picker.component';
import { IconName } from '../components/icon-picker/icon-picker.const';

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

export interface DrawingInfo {
  renderer?: {
    type?: string;
    symbol?: LayerSymbol;
    blur?: number;
    radius?: number;
    gradient?: Gradient;
    minOpacity?: number;
  };
}

export interface FeatureReduction {
  type: 'cluster';
  drawingInfo?: DrawingInfo;
  clusterRadius?: number;
}

export interface LayerDefinition {
  minZoom?: number;
  maxZoom?: number;
  featureReduction?: FeatureReduction;
  // Symbol
  drawingInfo?: DrawingInfo;
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

export interface PopupInfo {
  title?: string;
  description?: string;
  popupElements?: PopupElement[];
}

export interface LayerDatasource {
  resource?: string;
  refData?: string;
  layout?: string;
  aggregation?: string;
  geoField?: string;
  latitudeField?: string;
  longitudeField?: string;
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
  popupInfo?: PopupInfo;
  datasource?: LayerDatasource;
  createdAt: Date;
  updatedAt: Date;
}
