import gql from 'graphql-tag';
import { Form } from '../models/form.model';
import { Resource } from '../models/resource.model';
import { Role, User } from '../models/user.model';
import { Record } from '../models/record.model';
import { Notification } from '../models/notification.model';
import { Application } from '../models/application.model';

// === GET PROFILE ===
export const GET_PROFILE = gql`
{
  me {
    id
    username
    isAdmin
    name
    roles {
      id
      title
      application {
        id
      }
    }
    permissions {
      id
      type
      global
    }
    applications {
      id
      name
    }
    oid
  }
}`;

export interface GetProfileQueryResponse {
  loading: boolean;
  me: User;
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

// === GET ROLES ===
export const GET_ROLES = gql`
query GetRoles($application: ID) {
  roles(application: $application) {
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
      application {
        id
      }
    }
    oid
  }
}`;

export interface GetUsersQueryResponse {
  loading: boolean;
  users: User[];
}

// === GET NOTIFICATIONS ===
export const GET_NOTIFICATIONS = gql`
query GetNotifications {
  notifications {
    action
    content
    createdAt
  }
}`;

export interface GetNotificationsQueryResponse {
  loading: boolean;
  notifications: Notification[];
}

// === GET APPLICATION BY ID ===
export const GET_APPLICATION_BY_ID = gql`
  query GetApplicationById($id: ID!, $asRole: ID){
    application(id: $id, asRole: $asRole){
      id
      name
      description
      createdAt
      status
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
