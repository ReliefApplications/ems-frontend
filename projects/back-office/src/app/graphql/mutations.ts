import gql from 'graphql-tag';
import { Dashboard, Form, Role, User } from 'who-shared';

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

// === ADD DASHBOARD ===
export const ADD_DASHBOARD = gql`
mutation addDashboard($name: String!) {
  addDashboard(name: $name){
    id
    name
    structure
    createdAt
  }
}`;

export interface AddDashboardMutationResponse {
  loading: boolean;
  addDashboard: Dashboard;
}

// === DELETE DASHBOARD ===
export const DELETE_DASHBOARD = gql`
mutation deleteDashboard($id: ID!) {
  deleteDashboard(id: $id){
    id
    name
  }
}`;

export interface DeleteDashboardMutationResponse {
  loading: boolean;
  deleteDashboard: Dashboard;
}

// === ADD FORM ===
export const ADD_FORM = gql`
mutation addForm($name: String!, $newResource: Boolean, $resource: ID) {
  addForm(name: $name, newResource: $newResource, resource: $resource) {
    id
    name
    createdAt
    status
    versions {
      id
    }
  }
}`;

export interface AddFormMutationResponse {
  loading: boolean;
  addForm: Form;
}

// === DELETE FORM ===
export const DELETE_FORM = gql`
mutation deleteForm($id: ID!) {
  deleteForm(id: $id) {
    id
  }
}`;

export interface DeleteFormMutationResponse {
  loading: boolean;
  deleteForm: Form;
}
