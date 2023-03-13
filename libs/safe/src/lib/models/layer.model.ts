/**
 * Layer types for backend
 */
export enum LayerTypes {
  FEATURE_LAYER = 'FeatureLayer',
}

/** Layer documents interface declaration */
export interface Layer {
  id: string;
  name?: string;
  sublayers?: string[];
  createdAt?: Date;
  modifiedAt?: Date;
  //@ TODO upcoming implementation
  // visibility?: boolean;
  // layerType?: LayerTypes;
  // layerDefinition?: {
  //   featureReduction: any;
  //   drawingInfo: any;
  // };
  // popupInfo?: {
  //   popupElements: any[];
  //   description: string;
  // };
}
