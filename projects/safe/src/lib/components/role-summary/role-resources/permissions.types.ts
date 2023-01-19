/** Permission type for Resource */
export enum Permission {
  SEE = 'canSeeRecords',
  CREATE = 'canCreateRecords',
  UPDATE = 'canUpdateRecords',
  DELETE = 'canDeleteRecords',
}
/** Role access interface */
export interface Access {
  logic: string;
  filters: (
    | {
        field: string;
        operator: string;
        value?: string;
      }
    | Access
  )[];
}

export type ResourceRolePermissions = {
  [key in Permission]: {
    role: string;
    access?: Access;
  }[];
};
