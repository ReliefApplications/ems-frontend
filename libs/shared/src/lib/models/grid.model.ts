/**
 * Grid field interface
 */
export interface GridField {
  name: string;
  title: string;
  type: string;
  format: string;
  editor: string;
  filter: string;
  meta: Meta;
  disabled: boolean;
  hidden: boolean;
  width: number;
  order: number;
  canSee: boolean;
  subFields: GridField[];
}

/**
 * Meta property from grid field
 */
export interface Meta {
  type?: string;
  name: string;
  readOnly: boolean;
  permissions: Permissions;
  graphQLFieldName?: string;
  choices?: any[];
}

/**
 * Permissions property from meta property inside grid field
 */
export interface Permissions {
  canSee: boolean;
  canUpdate: boolean;
}
