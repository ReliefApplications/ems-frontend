import gql from 'graphql-tag';
import { Dashboard, Permission, Role, User } from 'who-shared';

// === GET USERS ===
export const GET_USERS = gql`
{
  users {
    id
    username
    name
    roles {
      id
      title
    }
    oid
  }
}`;

export interface GetUsersQueryResponse {
  loading: boolean;
  users: User[];
}

// === GET ROLES ===
export const GET_ROLES = gql`
{
  roles {
    id
    title
    permissions {
      id
      type
    }
    usersCount
  }
}`;

export interface GetRolesQueryResponse {
  loading: boolean;
  roles: Role[];
}

// === GET PERMISSIONS ===
export const GET_PERMISSIONS = gql`
{
  permissions {
    id
    type
  }
}`;

export interface GetPermissionsQueryResponse {
  loading: boolean;
  permissions: Permission[];
}

// === GET DASHBOARDS ===
export const GET_DASHBOARDS = gql`
{
  dashboards {
    id
    name
    createdAt
    structure
    canDelete
  }
}`;

export interface GetDashboardsQueryResponse {
  loading: boolean;
  dashboards: Dashboard[];
}
