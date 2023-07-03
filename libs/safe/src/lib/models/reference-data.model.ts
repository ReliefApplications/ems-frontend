import { ApiConfiguration } from './apiConfiguration.model';

/** Enum of referenceDataType. */
export enum referenceDataType {
  static = 'static',
  graphql = 'graphql',
  rest = 'rest',
}

/** Model for Reference data object. */
export interface ReferenceData {
  id?: string;
  name?: string;
  modifiedAt?: string;
  type?: referenceDataType;
  apiConfiguration?: ApiConfiguration;
  query?: string;
  fields?: { name: string; type: string }[];
  valueField?: string;
  path?: string;
  data?: any;
  graphQLFilter?: string;
  permissions?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}
