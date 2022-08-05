import { ApiConfiguration } from './apiConfiguration.model';

/** Interface for Mapping element. */
export interface Mapping {
  field: string;
  path: string;
  value: any;
  text: string;
}

/** Interface for Mapping array. */
export type Mappings = Array<Mapping>;

/** Api configuration documents interface declaration */
export interface Setting extends Document {
  kind: 'Setting';
  userManagement?: {
    local?: boolean;
    apiConfiguration?: ApiConfiguration;
    serviceAPI?: string;
    attributesMapping?: Mappings;
  };
  modifiedAt?: Date;
}
