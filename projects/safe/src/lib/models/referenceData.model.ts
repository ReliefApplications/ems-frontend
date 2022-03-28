/*  Enum of authType.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum type {
  static = 'static',
  graphQL = 'graphql',
  rest = 'rest',
}

/*  Model for ReferenceData object.
 */
export interface ReferenceData {
  id?: string;
  name?: string;
  type?: type;
  apiConfiguration?: string;
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
