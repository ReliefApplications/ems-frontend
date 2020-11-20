import gql from 'graphql-tag';
import { Dashboard, Form, Permission, Resource, Role, User, Record, Application, Page, Workflow } from '@who-ems/builder';

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

// === GET FORMS ===
export const GET_FORMS = gql`
{
  forms {
    id
    name
    createdAt
    status
    versions {
      id
    }
    recordsCount
    core
    canCreate
    canUpdate
    canDelete
  }
}`;

export interface GetFormsQueryResponse {
  loading: boolean;
  forms: Form[];
}

// === GET RESOURCE BY ID ===
export const GET_RESOURCE_BY_ID = gql`
query GetResourceById($id: ID!, $filters: JSON, $display: Boolean) {
  resource(id: $id) {
    id
    name
    createdAt
    records(filters: $filters) {
      id
      data(display: $display)
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
    canCreate
    canUpdate
  }
}`;

export interface GetResourceByIdQueryResponse {
  loading: boolean;
  resource: Resource;
}

// === GET RESOURCES ===
export const GET_RESOURCES = gql`
{
  resources {
    id
    name
    forms {
      id
      name
    }
  }
}`;

export const GET_RESOURCES_EXTENDED = gql`
{
  resources {
    id
    name
    createdAt
    recordsCount
  }
}`;

export interface GetResourcesQueryResponse {
  loading: boolean;
  resources: Resource[];
}

// === GET FORM BY ID ===

export const GET_FORM_BY_ID = gql`
query GetFormById($id: ID!, $filters: JSON, $display: Boolean) {
  form(id: $id) {
    id
    name
    createdAt
    structure
    status
    fields
    versions {
      id
      createdAt
      structure
    }
    records(filters: $filters) {
      id
      data(display: $display)
    }
    resource{
      id
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
    canCreate
    canUpdate
  }
}`;

export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}

// === GET RECORD BY ID ===
export const GET_RECORD_BY_ID = gql`
query GetRecordById($id: ID!) {
  record(id: $id) {
    id
    data
    form {
      id
      structure
    }
  }
}`;

export interface GetRecordByIdQueryResponse {
  loading: boolean;
  record: Record;
}

// === GET DASHBOARD BY ID ===
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!){
    dashboard(id: $id){
      id
      name
      createdAt
      structure
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
      page {
        id
        application {
          id
        }
      }
      step {
        id
        workflow {
          id
        }
      }
    }
  }
`;

export interface GetDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}

// === GET APPLICATIONS ===
export const GET_APPLICATIONS = gql`
{
  applications {
    id
    name
    createdAt
    modifiedAt
    pages {
      id
      name
      createdAt
      type
      content
    }
    settings
    permissions {
      canSee {
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
    canDelete
  }
}`;

export interface GetApplicationsQueryResponse {
  loading: boolean;
  applications: Application[];
}

// === GET APPLICATION BY ID ===
export const GET_APPLICATION_BY_ID = gql`
  query GetApplicationById($id: ID!){
    application(id: $id){
      id
      name
      createdAt
      pages {
        id
        name
        type
        content
        createdAt
        canSee
        canUpdate
        canDelete
      }
      roles {
        id
        title
        permissions {
          id
          type
        }
        usersCount
      }
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
  }
`;

export interface GetApplicationByIdQueryResponse {
  loading: boolean;
  application: Application;
}

// === GET PAGE BY ID ===
export const GET_PAGE_BY_ID = gql`
  query GetPageById($id: ID!){
    page(id: $id){
      id
      name
      createdAt
      modifiedAt
      type
      content
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
      application {
        id
      }
      canSee
      canUpdate
      canDelete
    }
  }
`;

export interface GetPageByIdQueryResponse {
  loading: boolean;
  page: Page;
}

// === GET WORKFLOW BY ID ===
export const GET_WORKFLOW_BY_ID = gql`
  query GetWorkflowById($id: ID!){
    workflow(id: $id){
      id
      name
      createdAt
      modifiedAt
      steps {
        id
        name
        type
        content
        createdAt
      }
      page {
        id
        name
        canUpdate
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
      }
    }
  }
`;

export interface GetWorkflowByIdQueryResponse {
  loading: boolean;
  workflow: Workflow;
}
