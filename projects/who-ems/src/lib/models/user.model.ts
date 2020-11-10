import { Application } from './application.model';

/*  Model for Permission object.
*/
export interface Permission {
    id?: string;
    type?: string;
}

/*  Model for Role object.
*/
export interface Role {
    id?: string;
    title?: string;
    usersCount?: number;
    permissions?: Permission[];
}

/*  Model for User object.
*/
export interface User {
    id?: string;
    username?: string;
    name?: string;
    roles?: Role[];
    permissions?: Permission[];
    oid?: string;
    applications?: Application[];
}

/*  Enum of admin permissions.
*/
export enum Permissions {
    canSeeResources = 'can_see_resources',
    canSeeForms = 'can_see_forms',
    canManageForms = 'can_manage_forms',
    canSeeUsers = 'can_see_users',
    canSeeRoles = 'can_see_roles',
    canManageDashboards = 'can_manage_dashboards',
    canManageApplications = 'can_manage_applications'
}

/*  Enum of permissions types.
*/
export enum PermissionType {
    access = 'access',
    create = 'create',
    update = 'update',
    delete = 'delete'
}

/*  Class to check for routes and methods what is the needed admin permission.
*/
export class PermissionsManagement {
    public static mappedPermissions = {
        resources: {
            access: Permissions.canSeeResources
        },
        forms: {
            access: Permissions.canSeeForms,
            create: Permissions.canManageForms
        },
        users: {
            list: {
                access: Permissions.canSeeUsers
            },
            roles: {
                access: Permissions.canSeeRoles
            }
        },
        dashboards: {
            create: Permissions.canManageDashboards
        },
        applications: {
            create: Permissions.canManageApplications
        }
    };

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

    public static getRightFromKeys(keys: string[], type: PermissionType): string {
        let value = this.mappedPermissions;
        for (const key of keys) {
            if (key in value) {
                value = value[key];
            }
        }
        return value[type];
    }
}
