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
  createdAt?: Date;
  modifiedAt?: Date;
}
