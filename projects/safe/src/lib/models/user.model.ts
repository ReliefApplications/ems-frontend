import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Application } from './application.model';
import { Channel } from './channel.model';
import { PositionAttribute } from './position-attribute.model';

/** Model for Permission object. */
export interface Permission {
  id?: string;
  type?: string;
  global?: boolean;
}

/** Model for Role object. */
export interface Role {
  id?: string;
  title?: string;
  description?: string;
  usersCount?: number;
  permissions?: Permission[];
  application?: Application;
  channels?: Channel[];
  autoAssignment?: CompositeFilterDescriptor[];
}

/** Model for Group object. */
export interface Group {
  id?: string;
  title?: string;
  description?: string;
  usersCount?: number;
}

/** Model for User object. */
export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  isAdmin?: boolean;
  name?: string;
  roles?: Role[];
  groups?: Group[];
  permissions?: Permission[];
  oid?: string;
  applications?: Application[];
  positionAttributes?: PositionAttribute[];
  favoriteApp?: string;
}

/** Enum of admin permissions. */
export enum Permissions {
  canSeeResources = 'can_see_resources',
  canSeeForms = 'can_see_forms',
  canSeeUsers = 'can_see_users',
  canSeeRoles = 'can_see_roles',
  canSeeApplications = 'can_see_applications',
  canManageForms = 'can_manage_forms',
  canCreateForms = 'can_create_forms',
  canCreateResources = 'can_create_resources',
  canManageResources = 'can_manage_resources',
  canManageApplications = 'can_manage_applications',
  canManageApiConfigurations = 'can_manage_api_configurations',
  canCreateApplications = 'can_create_applications',
}

/** Enum of permissions types. */
export enum PermissionType {
  access = 'access',
  create = 'create',
  update = 'update',
  delete = 'delete',
  manage = 'manage',
}

/** Class to check for routes and methods what is the needed admin permission. */
export class PermissionsManagement {
  public static mappedPermissions = {
    resources: {
      access: [Permissions.canSeeResources, Permissions.canCreateResources],
      create: [Permissions.canCreateResources, Permissions.canManageResources],
    },
    forms: {
      access: [Permissions.canSeeForms, Permissions.canCreateForms],
      create: [Permissions.canCreateForms, Permissions.canManageForms],
    },
    settings: {
      users: {
        access: Permissions.canSeeUsers,
      },
      roles: {
        access: Permissions.canSeeRoles,
      },
      apiconfigurations: {
        create: Permissions.canManageApiConfigurations,
        access: Permissions.canManageApiConfigurations,
      },
      pulljobs: {
        create: Permissions.canManageApiConfigurations,
        access: Permissions.canManageApiConfigurations,
      },
    },
    applications: {
      create: Permissions.canCreateApplications,
      manage: Permissions.canManageApplications,
      access: Permissions.canSeeApplications,
    },
  };

  /**
   * Get the permission object for an object defined by its path and a
   * permission type.
   *
   * @param {string} path - The path of the object we want the permission.
   * @param {PermissionType} type - The permission type
   * @returns The permission object
   */
  public static getRightFromPath(path: string, type: PermissionType): string {
    const pathArray = path.split('?')[0].split('/');
    pathArray.shift();
    // For subroutes
    if (pathArray.length > 2) {
      const subroute = pathArray[3];
      pathArray.splice(2);
      pathArray.push(subroute);
    }
    return this.getRightFromKeys(pathArray, type);
  }

  /**
   * Get the permission object for an object defined by a list of keys and a
   * permission type
   *
   * @param keys - The list of keys defining the object
   * @param type - The permission type
   * @returns The permission object
   */
  public static getRightFromKeys(keys: string[], type: PermissionType): string {
    let value = this.mappedPermissions;
    for (const key of keys) {
      if (key in value) {
        value = (value as any)[key];
      }
    }
    return (value as any)[type];
  }
}
