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

// === EDIT ROLE ===
export const EDIT_ROLE = gql`
mutation editRole($id: ID!, $permissions: [ID]!) {
  editRole(id: $id, permissions: $permissions) {
    id
    title
    usersCount
  }
}`;

export interface EditRoleMutationResponse {
  loading: boolean;
  editRole: Role;
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
      application {
        id
      }
    }
    oid
  }
}`;

export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}
