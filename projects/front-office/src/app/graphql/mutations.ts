import {gql} from 'apollo-angular';

import { Role, User } from '@safe/builder';

/**
 * Add Role to application mutation.
 */
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

/**
 * Interface of Add Role mutation response.
 */
export interface AddRoleMutationResponse {
  /** Loading state of the query */
  loading: boolean;
  /** New role */
  addRole: Role;
}

/**
 * Edit application role mutation.
 */
export const EDIT_ROLE = gql`
mutation editRole($id: ID!, $permissions: [ID]!) {
  editRole(id: $id, permissions: $permissions) {
    id
    title
    usersCount
  }
}`;

/**
 * Interface of edit application role mutation response.
 */
export interface EditRoleMutationResponse {
  /** Loading state of the query */
  loading: boolean;
  /** Edited role */
  editRole: Role;
}

/**
 * Edit user of application mutation.
 */
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

/**
 * Interface of edit user mutation response.
 */
export interface EditUserMutationResponse {
  /** Loading state of the query */
  loading: boolean;
  /** Edited user */
  editUser: User;
}
