import gql from 'graphql-tag';
import { Form } from '../models/form.model';
import { Resource } from '../models/resource.model';
import { Role, User } from '../models/user.model';
import { Record } from '../models/record.model';

// === GET PROFILE ===
export const GET_PROFILE = gql`
{
  me {
    id
    username
    name
    roles {
      title
    }
    permissions {
      type
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
