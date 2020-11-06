import gql from 'graphql-tag';
import { Dashboard, Form, Resource, Role, User, Record } from '@who-ems';

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

// === EDIT RESOURCE ===
export const EDIT_RESOURCE = gql`
mutation editResource($id: ID!, $permissions: JSON) {
  editResource(id: $id, permissions: $permissions) {
    id
    name
    createdAt
    records {
      id
      data(display: true)
    }
    fields
    forms {
      id
      name
      status
      createdAt
      recordsCount
      core
      canCreate
      canUpdate
      canDelete
    }
    permissions {
      canSee {
        id
        title
      }
      canCreate {
        id
        title
      }
      canUpdate {
        id
        title
      }
      canDelete {
        id
        title
      }
    }
    canUpdate
  }
}`;

export interface EditResourceMutationResponse {
  loading: boolean;
  editResource: Resource;
}

// === DELETE RECORD ===
export const DELETE_RECORD = gql`
mutation deleteRecord($id: ID!) {
  deleteRecord(id: $id) {
    id
  }
}`;

export interface DeleteRecordMutationResponse {
  loading: boolean;
  deleteRecord: Record;
}

// === EDIT FORM ===
export const EDIT_FORM_STRUCTURE = gql`
mutation editForm($id: ID!, $structure: JSON!) {
  editForm(id: $id, structure: $structure) {
    id
    name
    createdAt
    status
    versions {
      id
      createdAt
      structure
    }
    permissions {
      canSee {
        id
        title
      }
      canCreate {
        id
        title
      }
      canUpdate {
        id
        title
      }
      canDelete {
        id
        title
      }
    }
    canUpdate
  }
}`;

export const EDIT_FORM_STATUS = gql`
mutation editForm($id: ID!, $status: String!) {
  editForm(id: $id, status: $status) {
    id
    name
    createdAt
    status
    versions {
      id
      createdAt
      structure
    }
    permissions {
      canSee {
        id
        title
      }
      canCreate {
        id
        title
      }
      canUpdate {
        id
        title
      }
      canDelete {
        id
        title
      }
    }
    canUpdate
  }
}`;

export const EDIT_FORM_NAME = gql`
mutation editForm($id: ID!, $name: String!){
  editForm(id: $id, name: $name){
    id
    name
    createdAt
    status
    versions {
      id
      createdAt
      structure
    }
    permissions {
      canSee {
        id
        title
      }
      canCreate {
        id
        title
      }
      canUpdate {
        id
        title
      }
      canDelete {
        id
        title
      }
    }
    canUpdate
  }
}`;

export const EDIT_FORM_PERMISSIONS = gql`
mutation editForm($id: ID!, $permissions: JSON!){
  editForm(id: $id, permissions: $permissions){
    id
    name
    createdAt
    status
    versions {
      id
      createdAt
      structure
    }
    permissions {
      canSee {
        id
        title
      }
      canCreate {
        id
        title
      }
      canUpdate {
        id
        title
      }
      canDelete {
        id
        title
      }
    }
    canUpdate
  }
}`;


export interface EditFormMutationResponse {
  loading: boolean;
  editForm: Form;
}

// === EDIT DASHBOARD ===
export const EDIT_DASHBOARD = gql`
mutation editDashboard($id: ID!, $structure: JSON, $name: String, $permissions: JSON) {
  editDashboard(id: $id, structure: $structure, name: $name, permissions: $permissions) {
    id
    name
    structure
    modifiedAt
    permissions {
      canSee {
        id
        title
      }
      canCreate {
        id
        title
      }
      canUpdate {
        id
        title
      }
      canDelete {
        id
        title
      }
    }
    canSee
    canUpdate
  }
}`;

export interface EditDashboardMutationResponse {
  loading: boolean;
  editDashboard: Dashboard;
}
