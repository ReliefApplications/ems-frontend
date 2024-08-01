import { Access } from '../../../services/filters/filters.service';

/** Permission type for Resource */
export enum Permission {
  SEE = 'canSeeRecords',
  CREATE = 'canCreateRecords',
  UPDATE = 'canUpdateRecords',
  DELETE = 'canDeleteRecords',
}

export type ResourceRolePermissions = {
  [key in Permission]: {
    role: string;
    access?: Access;
  }[];
};
