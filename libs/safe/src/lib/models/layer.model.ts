/**
 * Layer types for backend
 */
export enum LayerTypes {
  FEATURE_LAYER = 'FeatureLayer',
}

/** Layer documents interface declaration */
export interface Layer {
  name?: string;
  sublayers?: any[];
  createdAt?: Date;
  modifiedAt?: Date;
  visibility?: boolean;
  layerType?: LayerTypes;
  layerDefinition?: {
    featureReduction: any;
    drawingInfo: any;
  };
  popupInfo?: {
    popupElements: any[];
    description: string;
  };
}
