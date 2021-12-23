import { gql } from 'apollo-angular';
import { Dashboard, Application, Form, User, Workflow, Permission, Step, Page} from '@safe/builder';

/**
 * Application users query.
 */
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

/**
 * Interface of application users query response.
 */
export interface GetUsersQueryResponse {
  /** Loading state of the query */
  loading: boolean;
  /** Application users */
  users: User[];
}

/**
 * Dashboard query.
 */
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

/**
 * Interface of dashboard query response.
 */
export interface GetDashboardByIdQueryResponse {
  /** Loading state of the query */
  loading: boolean;
  /** Application dashboard */
  dashboard: Dashboard;
}

/**
 * Application query.
 */
export const GET_APPLICATION_BY_ID = gql`
  query GetApplicationById($id: ID!) {
    application(id: $id) {
      id
      name
      pages {
        id
        name
        type
        content
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
    }
  }
`;

/**
 * Interface of application query response.
 */
export interface GetApplicationByIdQueryResponse {
  /** Loading state of the query */
  loading: boolean;
  /** User accessible application */
  application: Application;
}

/**
 * Form query.
 */
export const GET_FORM_BY_ID = gql`
query GetFormById($id: ID!) {
  form(id: $id) {
    id
    name
    structure
    fields
    status
    canUpdate
    canCreateRecords
    uniqueRecord {
      id
      modifiedAt
      data
    }
  }
}`;

/**
 * Interface of form query response.
 */
export interface GetFormByIdQueryResponse {
  /** Loading state of the query */
  loading: boolean;
  /** Application form */
  form: Form;
}

/**
 * Workflow query.
 */
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

/**
 * Interface of workflow query response.
 */
export interface GetWorkflowByIdQueryResponse {
  /** Loading state of the query */
  loading: boolean;
  /** Application workflow */
  workflow: Workflow;
}

/**
 * Application permissions query.
 */
export const GET_PERMISSIONS = gql`
query GetPermissions($application: Boolean) {
  permissions(application: $application) {
    id
    type
    global
  }
}`;

/**
 * Interface of application permissions query.
 */
export interface GetPermissionsQueryResponse {
  /** Loading state of the query */
  loading: boolean;
  /** List of application permissions */
  permissions: Permission[];
}

/**
 * Workflow step query.
 */
export const GET_STEP_BY_ID = gql`
  query GetStepById($id: ID!){
    step(id: $id){
      id
      name
      createdAt
      modifiedAt
      content
      canSee
    }
  }
`;

/**
 * Interface of workflow step query response.
 */
export interface GetStepByIdQueryResponse {
  /** Loading state of the query */
  loading: boolean;
  /** Application step */
  step: Step;
}

/**
 * Application page query.
 */
export const GET_PAGE_BY_ID = gql`
  query GetPageById($id: ID!){
    page(id: $id){
      id
      name
      createdAt
      modifiedAt
      type
      content
      canSee
    }
  }
`;

/**
 * Interface of application page query.
 */
export interface GetPageByIdQueryResponse {
  /** Loading state of the query */
  loading: boolean;
  /** Application page */
  page: Page;
}
