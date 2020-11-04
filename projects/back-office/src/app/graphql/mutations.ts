import gql from 'graphql-tag';
import { Role, User } from 'who-shared';

// === EDIT USER ===
export const EDIT_USER = gql`
mutation editUser($id: ID!, $roles: [ID]!) {
  editUser(id: $id, roles: $roles) {
    id
  }
}`;

export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}

// === ADD RECORD ===
export const ADD_ROLE = gql`
mutation addRole($title: String!) {
  addRole(title: $title) {
    id
    title
    usersCount
  }
}`;

export interface AddRoleMutationResponse {
  loading: boolean;
  addRole: Role;
}

// === ADD RECORD ===
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
