import gql from 'graphql-tag';
import { Dashboard, Role, User } from 'who-shared';

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
