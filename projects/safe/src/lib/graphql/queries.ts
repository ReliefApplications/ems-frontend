import { gql } from 'apollo-angular';
import { Form } from '../models/form.model';
import { Resource } from '../models/resource.model';
import { Role, User, Permission } from '../models/user.model';
import { Record } from '../models/record.model';
import { Notification } from '../models/notification.model';
import { Application } from '../models/application.model';
import { Channel } from '../models/channel.model';
import { Workflow } from '../models/workflow.model';
import { Dashboard } from '../models/dashboard.model';
import { ReferenceData } from '../models/reference-data.model';

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
        permissions {
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
        positionAttributes {
          value
        }
        name
        role {
          title
        }
      }
      oid
      favoriteApp
    }
  }
`;

export interface GetProfileQueryResponse {
  loading: boolean;
  me: User;
}

// === GET FORM BY ID ===
export const GET_FORM_STRUCTURE = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      structure
    }
  }
`;

export const GET_GRID_FORM_META = gql`
  query GetFormAsTemplate($id: ID!) {
    form(id: $id) {
      id
      name
      queryName
      layouts {
        id
        name
        createdAt
        query
        display
      }
    }
  }
`;

export const GET_FORM_BY_ID = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      name
      createdAt
      structure
      status
      fields
      resource {
        id
      }
      canUpdate
    }
  }
`;

export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}

// === GET RELATED FORMS FROM RESOURCE ===

export const GET_GRID_RESOURCE_META = gql`
  query GetGridResourceMeta($resource: ID!) {
    resource(id: $resource) {
      id
      name
      queryName
      forms {
        id
        name
      }
      relatedForms {
        id
        name
        fields
      }
      layouts {
        id
        name
        query
        createdAt
        display
      }
    }
  }
`;

export const GET_SHORT_RESOURCE_BY_ID = gql`
  query GetShortResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
    }
  }
`;

// === GET RESOURCE BY ID ===
export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($id: ID!, $filter: JSON, $display: Boolean) {
    resource(id: $id) {
      id
      name
      createdAt
      records(filter: $filter) {
        edges {
          node {
            id
            data(display: $display)
          }
          cursor
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      fields
      forms {
        id
        name
        status
        createdAt
        recordsCount
        core
        canUpdate
        canDelete
      }
      coreForm {
        uniqueRecord {
          id
        }
      }
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
      canUpdate
    }
  }
`;

export interface GetResourceByIdQueryResponse {
  loading: boolean;
  resource: Resource;
}

// === GET FORMS ===

export const GET_FORMS = gql`
  query GetFormNames($first: Int, $afterCursor: ID, $filter: JSON) {
    forms(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          name
          core
          resource {
            id
          }
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export interface GetFormsQueryResponse {
  loading: boolean;
  forms: {
    edges: {
      node: Form;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

// === GET RESOURCES ===
export const GET_RESOURCES = gql`
  query GetResources($first: Int, $afterCursor: ID) {
    resources(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export interface GetResourcesQueryResponse {
  loading: boolean;
  resources: {
    edges: {
      node: Resource;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

// === GET RECORD BY ID ===

export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      data
      createdAt
      modifiedAt
      createdBy {
        name
      }
      modifiedBy {
        name
      }
      form {
        id
        structure
        permissions {
          recordsUnicity
        }
      }
    }
  }
`;

export interface GetRecordByIdQueryResponse {
  loading: boolean;
  record: Record;
}

// === GET RECORD DETAILS ===
export const GET_RECORD_DETAILS = gql`
  query GetRecordDetails($id: ID!) {
    record(id: $id) {
      id
      data
      createdAt
      modifiedAt
      createdBy {
        name
      }
      form {
        id
        name
        createdAt
        structure
        fields
        core
        resource {
          id
          name
          forms {
            id
            name
            structure
            fields
            core
          }
        }
      }
      versions {
        id
        createdAt
        data
        createdBy {
          name
        }
      }
    }
  }
`;

export interface GetRecordDetailsQueryResponse {
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
      channels {
        id
        title
        application {
          id
          name
        }
      }
    }
  }
`;

export interface GetRolesQueryResponse {
  loading: boolean;
  roles: Role[];
}

// === GET USERS ===
export const GET_USERS = gql`
  query GetUsers($applications: [ID]) {
    users(applications: $applications) {
      id
      username
      name
      oid
    }
  }
`;

export interface GetUsersQueryResponse {
  loading: boolean;
  users: User[];
}

// === GET NOTIFICATIONS ===
export const GET_NOTIFICATIONS = gql`
  query GetNotifications($first: Int, $afterCursor: ID) {
    notifications(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          action
          content
          createdAt
          channel {
            id
            title
            application {
              id
            }
          }
          seenBy {
            id
            name
          }
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export interface GetNotificationsQueryResponse {
  loading: boolean;
  notifications: {
    edges: {
      node: Notification;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

// === GET APPLICATION BY ID ===
export const GET_APPLICATION_BY_ID = gql`
  query GetApplicationById($id: ID!, $asRole: ID) {
    application(id: $id, asRole: $asRole) {
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
        channels {
          id
          title
          application {
            id
            name
          }
        }
        application {
          id
          name
        }
      }
      users {
        id
        username
        name
        roles {
          id
          title
        }
        positionAttributes {
          value
          category {
            id
            title
          }
        }
        oid
      }
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
      channels {
        id
        title
        subscribedRoles {
          id
          title
          application {
            id
            name
          }
          usersCount
        }
      }
      subscriptions {
        routingKey
        title
        channel {
          id
          title
        }
        convertTo {
          id
          name
        }
      }
      canSee
      canUpdate
      canDelete
      positionAttributeCategories {
        id
        title
      }
      locked
      lockedByUser
    }
  }
`;

export interface GetApplicationByIdQueryResponse {
  loading: boolean;
  application: Application;
}

// === GET APPLICATIONS ===
export const GET_APPLICATIONS = gql`
  query GetApplications($first: Int, $afterCursor: ID, $filter: JSON) {
    applications(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          name
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
export interface GetApplicationsQueryResponse {
  loading: boolean;
  applications: {
    edges: {
      node: Application;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

// === GET ROLES FROM APPLICATION ===
export const GET_ROLES_FROM_APPLICATIONS = gql`
  query GetRolesFromApplications($applications: [ID]!) {
    rolesFromApplications(applications: $applications) {
      id
      title(appendApplicationName: true)
    }
  }
`;

export interface GetRolesFromApplicationsQueryResponse {
  loading: boolean;
  rolesFromApplications: Role[];
}

// === GET PERMISSIONS ===
export const GET_PERMISSIONS = gql`
  query GetPermissions($application: Boolean) {
    permissions(application: $application) {
      id
      type
      global
    }
  }
`;

export interface GetPermissionsQueryResponse {
  loading: boolean;
  permissions: Permission[];
}

// === GET QUERY TYPES ===
export const GET_QUERY_TYPES = gql`
  query GetQueryTypes {
    __schema {
      types {
        name
        kind
        fields {
          name
          args {
            name
            type {
              name
              kind
              inputFields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            ofType {
              name
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                  }
                }
              }
            }
          }
        }
      }
      queryType {
        name
        kind
        fields {
          name
          args {
            name
            type {
              name
              kind
              inputFields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            ofType {
              name
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// TODO: check type of __schema
export interface GetQueryTypes {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __schema: any;
}

// === GET TYPE ===
export const GET_TYPE = gql`
  query GetType($name: String!) {
    __type(name: $name) {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            fields {
              name
              type {
                kind
              }
            }
          }
        }
      }
    }
  }
`;

export interface GetType {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __type: any;
}

// === GET CHANNELS ===
export const GET_CHANNELS = gql`
  query getChannels($application: ID) {
    channels(application: $application) {
      id
      title
      application {
        id
        name
      }
    }
  }
`;

export interface GetChannelsQueryResponse {
  loading: boolean;
  channels: Channel[];
}

// === GET WORKFLOW BY ID ===
export const GET_WORKFLOW_BY_ID = gql`
  query GetWorkflowById($id: ID!, $asRole: ID) {
    workflow(id: $id, asRole: $asRole) {
      id
      name
      createdAt
      modifiedAt
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
      steps {
        id
        name
        type
        content
        createdAt
        canDelete
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
        application {
          id
        }
      }
    }
  }
`;

export interface GetWorkflowByIdQueryResponse {
  loading: boolean;
  workflow: Workflow;
}

// === GET DASHBOARD BY ID ===
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    dashboard(id: $id) {
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
      page {
        id
        application {
          id
        }
        canUpdate
      }
      step {
        id
        workflow {
          id
          page {
            id
            application {
              id
            }
          }
        }
        canUpdate
      }
    }
  }
`;

export interface GetDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}

export const GET_RESOURCE_RECORDS = gql`
  query GetResourceRecords(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $filter: JSON
    $display: Boolean
  ) {
    resource(id: $id) {
      records(first: $first, afterCursor: $afterCursor, filter: $filter) {
        edges {
          node {
            id
            data(display: $display)
            versions {
              id
              createdAt
              data
            }
            form {
              id
              name
            }
          }
          cursor
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export interface GetResourceRecordsQueryResponse {
  loading: boolean;
  resource: {
    records: {
      edges: {
        node: Record;
        cursor: string;
      }[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      totalCount: number;
    };
  };
}

// === GET REFERENCE DATAS ===
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas($first: Int, $afterCursor: ID) {
    referenceDatas(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export interface GetReferenceDatasQueryResponse {
  loading: boolean;
  referenceDatas: {
    edges: {
      node: ReferenceData;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

export const GET_REFERENCE_DATA_BY_ID = gql`
  query GetShortReferenceDataById($id: ID!) {
    referenceData(id: $id) {
      id
      name
      type
      apiConfiguration {
        name
      }
      query
      fields
      valueField
      path
      data
    }
  }
`;

export const GET_SHORT_REFERENCE_DATA_BY_ID = gql`
  query GetShortReferenceDataById($id: ID!) {
    referenceData(id: $id) {
      id
      name
    }
  }
`;

export interface GetReferenceDataByIdQueryResponse {
  loading: boolean;
  referenceData: ReferenceData;
}
