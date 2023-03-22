import { IconName } from '../components/ui/map/const/fa-icons';

/**
 * Layer types for backend
 */
export enum LayerTypes {
  FEATURE_LAYER = 'FeatureLayer',
}

/** Layer documents interface declaration */
export interface Layer {
  id: string;
  name: string;
  createdAt?: Date;
  modifiedAt?: Date;
  type: string;
  defaultVisibility: boolean;
  opacity: number;
  visibilityRangeStart: number;
  visibilityRangeEnd: number;
  // Layer style
  style: {
    color: string;
    size: number;
    icon: IconName | 'leaflet_default';
  };
  // Layer datasource
  datasource: {
    origin: any;
    resource: any;
    layout: any;
    aggregation: any;
    refData: any;
  };
}
