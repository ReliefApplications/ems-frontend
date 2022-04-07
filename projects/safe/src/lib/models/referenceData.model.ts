import { ApiConfiguration } from './apiConfiguration.model';

/*  Enum of referenceType.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum referenceType {
  static = 'static',
  graphql = 'graphql',
  rest = 'rest',
}

/*  Model for ReferenceData object.
 */
export interface ReferenceData {
  id?: string;
  name?: string;
  type?: referenceType;
  apiConfiguration?: ApiConfiguration;
  query?: string;
  fields?: string[];
  valueField?: string;
  path?: string;
  data?: any;
  permissions?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}
