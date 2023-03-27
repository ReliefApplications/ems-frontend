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
export interface Layer {
  id: string;
  name: string;
  sublayers?: Layer[];
  visibility: boolean;
  layerType: string;
  layerDefinition: {
    featureReduction: any;
    drawingInfo: any;
  };
  popupInfo: {
    popupElements: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
