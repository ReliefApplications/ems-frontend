import gql from 'graphql-tag';
import { Dashboard, Application, Form, User } from '@who-ems/builder';

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
    }
  }
`;

export interface GetDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}

// === GET APPLICATION BY ID ===
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

export interface GetApplicationByIdQueryResponse {
  loading: boolean;
  application: Application;
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
