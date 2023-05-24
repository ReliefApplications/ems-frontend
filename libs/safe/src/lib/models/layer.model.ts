import { Gradient } from '../components/gradient-picker/gradient-picker.component';
import { IconName } from '../components/icon-picker/icon-picker.const';
import { LayerType } from '../components/ui/map/interfaces/layer-settings.type';

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

/**
 * Unique value info
 */
export interface UniqueValueInfo {
  label: string;
  value: string;
  symbol: LayerSymbol;
}

/**
 * Layer Drawing info interface
 */
export interface DrawingInfo {
  renderer?: {
    type?: string;
    symbol?: LayerSymbol;
    blur?: number;
    radius?: number;
    gradient?: Gradient;
    minOpacity?: number;
    defaultLabel?: string;
    defaultSymbol?: LayerSymbol;
    field1?: string;
    uniqueValueInfos?: UniqueValueInfo[];
  };
}

/**
 * Layer Feature Reduction interface
 */
export interface FeatureReduction {
  type: 'cluster';
  drawingInfo?: DrawingInfo;
  clusterRadius?: number;
}

/**
 * Layer Definition interface
 */
export interface LayerDefinition {
  minZoom?: number;
  maxZoom?: number;
  featureReduction?: FeatureReduction;
  // Symbol
  drawingInfo?: DrawingInfo;
}

/**
 * Layer Popup Text element interface
 */
export interface PopupElementText {
  type: 'text';
  text?: string;
}

/**
 * Layer Popup Fields element interface
 */
export interface PopupElementFields {
  type: 'fields';
  title?: string;
  description?: string;
  fields?: string[];
}

/** Possible types of Popup element */
export type PopupElementType = 'text' | 'fields';

/**
 * Layer Popup element interface
 */
export interface PopupElement
  extends Omit<PopupElementText, 'type'>,
    Omit<PopupElementFields, 'type'> {
  type: PopupElementType;
}

/**
 * Layer Popup info interface
 */
export interface PopupInfo {
  title?: string;
  description?: string;
  popupElements?: PopupElement[];
}

/**
 * Layer Datasource interface
 */
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
  type?: LayerType;
  sublayers?: LayerModel[];
  visibility: boolean;
  opacity: number;
  layerDefinition?: LayerDefinition;
  popupInfo?: PopupInfo;
  datasource?: LayerDatasource;
  createdAt: Date;
  updatedAt: Date;
}
