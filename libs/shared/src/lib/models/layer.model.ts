import { FaIconName } from '@oort-front/ui';
import { Gradient } from '../components/controls/gradient-picker/gradient-picker.component';
import { LayerType } from '../components/ui/map/interfaces/layer-settings.type';
import { HeatMapOptions as HeatMapOptionsWithoutOpacity } from 'leaflet';
import { AdminIdentifier } from '../services/map/map-polygons.service';

/**
 * Layer types for backend
 */
export enum BackendLayerTypes {
  FEATURE_LAYER = 'FeatureLayer',
}

export type LayerSymbolOutline = {
  color: string;
  width: number;
};

export type LayerSymbol = {
  color: string;
  size: number;
  style: FaIconName;
  outline?: LayerSymbolOutline;
};

/**
 * Base info
 */
interface BaseInfo {
  label: string;
  symbol: LayerSymbol;
}

/**
 * Unique value info
 */
export interface UniqueValueInfo extends BaseInfo {
  value: string;
}

/**
 * Class break info
 */
export interface ClassBreakInfo extends BaseInfo {
  maxValue: number;
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
    minValue?: number;
    uniqueValueInfos?: UniqueValueInfo[];
    classBreakInfos?: ClassBreakInfo[];
  };
}

/**
 * Layer Feature Reduction interface
 */
export interface FeatureReduction {
  type: 'cluster';
  drawingInfo?: DrawingInfo;
  clusterRadius?: number;
  lightMode?: boolean;
  fontSize?: number;
  autoSizeCluster?: boolean;
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

/**
 * Layer Popup Fields type interface
 */
export interface Fields {
  label: string;
  name: string;
  type: string;
  text?: string;
  fields?: Fields[];
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
  fieldsInfo?: Fields[];
}

export type LayerDatasourceType = 'Point' | 'Polygon';

/**
 * Layer Datasource interface
 */
export interface LayerDatasource {
  resource?: string;
  refData?: string;
  referenceDataVariableMapping?: string;
  layout?: string;
  aggregation?: string;
  geoField?: string;
  adminField?: AdminIdentifier;
  latitudeField?: string;
  longitudeField?: string;
  type?: LayerDatasourceType;
}

/**
 * Backend layer model
 */
export interface LayerModel {
  id: string;
  name: string;
  type?: LayerType;
  sublayers?: string[];
  visibility: boolean;
  opacity: number;
  layerDefinition?: LayerDefinition;
  popupInfo?: PopupInfo;
  datasource?: LayerDatasource;
  createdAt: Date;
  updatedAt: Date;
  contextFilters?: string;
  at?: string;
}

/** Model for AddLayerMutationResponse object */
export interface AddLayerMutationResponse {
  addLayer: LayerModel;
}

/** Model for DeleteLayerMutationResponse object */
export interface DeleteLayerMutationResponse {
  deleteLayer: LayerModel;
}

/** Edit layer gql mutation response interface */
export interface EditLayerMutationResponse {
  editLayer: LayerModel;
}

/** Model for GetLayerQueryResponse object */
export interface LayerQueryResponse {
  layer: LayerModel;
}

/** Model for GetLayersQueryResponse object */
export interface LayersQueryResponse {
  layers: LayerModel[];
}

/**
 * Extend heat map options interface with opacity
 */
export interface HeatMapOptions extends HeatMapOptionsWithoutOpacity {
  opacity?: number | undefined;
  pane?: any;
}
