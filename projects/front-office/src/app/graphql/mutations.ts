import gql from 'graphql-tag';
import { Role, User } from '@who-ems/builder';

// === ADD ROLE ===
export const ADD_ROLE = gql`
mutation addRole($title: String!, $application: ID) {
  addRole(title: $title, application: $application) {
    id
    title
    permissions {
      id
      type
    }
    usersCount
  }
}`;

export interface AddRoleMutationResponse {
  loading: boolean;
  addRole: Role;
}

export const ADD_ROLE_TO_USER = gql`
mutation addRoleToUser($id: ID!, $role: ID!) {
  addRoleToUser(id: $id, role: $role) {
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

export interface AddRoleToUserMutationResponse {
  loading: boolean;
  addRoleToUser: User;
}

// === EDIT USER ===
export const EDIT_USER = gql`
mutation editUser($id: ID!, $roles: [ID]!, $application: ID) {
  editUser(id: $id, roles: $roles, application: $application) {
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

export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}
