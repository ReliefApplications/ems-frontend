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
import { RecordHistory } from '../models/recordsHistory';

// === GET PROFILE ===

/** Graphql request for getting profile of the current user */
export const GET_PROFILE = gql`
  {
    me {
      id
      firstName
      lastName
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

/** Model for GetProfileQueryResponse object */
export interface GetProfileQueryResponse {
  loading: boolean;
  me: User;
}

// === GET FORM BY ID ===

/** Graphql request for getting the form structure by its id */
export const GET_FORM_STRUCTURE = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      structure
    }
  }
`;

/** Graphql request for getting the meta fields of a grid by form id */
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

/** Graphql request for getting form data by its id */
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

/** Model for GetFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}

// === GET RELATED FORMS FROM RESOURCE ===

/** Graphql request for getting resource meta date for a grid */
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

// === GET RESOURCE BY ID ===

/** Graphql request for getting the name of a resource by its id */
export const GET_SHORT_RESOURCE_BY_ID = gql`
  query GetShortResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
    }
  }
`;

/** Graphql request for getting data of a resource by its id */
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

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  loading: boolean;
  resource: Resource;
}

// === GET FORMS ===

/** Graphql request for getting forms */
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

/** Model for GetFormsQueryResponse object */
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

/** Graphql request for getting resources */
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

/** Model for GetResourcesQueryResponse object */
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

/** Graphql request for getting a record by its id */
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

/** GraphQL query definition for getting record details for history purpose */
export const GET_RECORD_BY_ID_FOR_HISTORY = gql`
  query GetRecordByIdForHistory($id: ID!) {
    record(id: $id) {
      id
      incrementalId
      form {
        id
        fields
        structure
      }
    }
  }
`;

/** Model for GetRecordByIdQueryResponse object */
export interface GetRecordByIdQueryResponse {
  loading: boolean;
  record: Record;
}

// === GET RECORD DETAILS ===

/** Graphql request for getting record details by its id */
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

/** Model for GetRecordDetailsQueryResponse object */
export interface GetRecordDetailsQueryResponse {
  loading: boolean;
  record: Record;
}

// === GET ROLES ===

/** Graphql request for getting roles (optionnally by an application id) */
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

/** Model for GetRolesQueryResponse object */
export interface GetRolesQueryResponse {
  loading: boolean;
  roles: Role[];
}

// === GET USERS ===

/** Graphql request for getting users (optionnally by a list of application ids) */
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

/** Model for GetUsersQueryResponse object */
export interface GetUsersQueryResponse {
  loading: boolean;
  users: User[];
}

// === GET NOTIFICATIONS ===

/** Graphql request for getting notifications */
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

/** Model for GetNotificationsQueryResponse object */
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

/** Graphql request for getting application data by its id */
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

/** Model for GetApplicationByIdQueryResponse object */
export interface GetApplicationByIdQueryResponse {
  loading: boolean;
  application: Application;
}

// === GET APPLICATIONS ===

/** Graphql request for getting the list of applications */
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

/** Model for GetApplicationsQueryResponse object */
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

/** Graphql request for getting roles of applications by the application ids */
export const GET_ROLES_FROM_APPLICATIONS = gql`
  query GetRolesFromApplications($applications: [ID]!) {
    rolesFromApplications(applications: $applications) {
      id
      title(appendApplicationName: true)
    }
  }
`;

/** Model for GetRolesFromApplicationsQueryResponse object */
export interface GetRolesFromApplicationsQueryResponse {
  loading: boolean;
  rolesFromApplications: Role[];
}

// === GET PERMISSIONS ===

/** Graphql request for getting permissions */
export const GET_PERMISSIONS = gql`
  query GetPermissions($application: Boolean) {
    permissions(application: $application) {
      id
      type
      global
    }
  }
`;

/** Model for GetPermissionsQueryResponse object */
export interface GetPermissionsQueryResponse {
  loading: boolean;
  permissions: Permission[];
}

// === GET QUERY TYPES ===

/** Graphql request for getting query types */
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
/** Model for GetQueryTypes object */
export interface GetQueryTypes {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __schema: any;
}

// === GET TYPE ===

/** Graphql request for getting type info by its name */
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

/** Model for GetType object */
export interface GetType {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __type: any;
}

// === GET CHANNELS ===

/** Graphql request for getting channels (optionnally by an application id) */
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

/** Model for GetChannelsQueryResponse object */
export interface GetChannelsQueryResponse {
  loading: boolean;
  channels: Channel[];
}

// === GET WORKFLOW BY ID ===

/** Graphql request for getting workflow by its id */
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

/** Model for GetWorkflowByIdQueryResponse object */
export interface GetWorkflowByIdQueryResponse {
  loading: boolean;
  workflow: Workflow;
}

// === GET DASHBOARD BY ID ===

/** Graphql request for getting a dashboard by its id */
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

/** Model for GetDashboardByIdQueryResponse object */
export interface GetDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}
/** graphql request for getting records of a resource by its id */
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
/** Modelf for GetResouceRecordsQueryResponse object */
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
/**
 *
 */
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

/**
 *
 */
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

/**
 *
 */
export const GET_REFERENCE_DATA_BY_ID = gql`
  query GetShortReferenceDataById($id: ID!) {
    referenceData(id: $id) {
      id
      name
      modifiedAt
      type
      apiConfiguration {
        name
        graphQLEndpoint
      }
      query
      fields
      valueField
      path
      data
      graphQLFilter
    }
  }
`;

/**
 *
 */
export const GET_SHORT_REFERENCE_DATA_BY_ID = gql`
  query GetShortReferenceDataById($id: ID!) {
    referenceData(id: $id) {
      id
      name
    }
  }
`;

/**
 *
 */
export interface GetReferenceDataByIdQueryResponse {
  loading: boolean;
  referenceData: ReferenceData;
}

/**
 *
 */
export const GET_RECORD_HISTORY_BY_ID = gql`
  query GetRecordHistoryByID($id: ID!, $lang: String) {
    recordHistory(id: $id, lang: $lang) {
      createdAt
      createdBy
      changes {
        type
        field
        displayName
        old
        new
      }
      version {
        id
        createdAt
        data
      }
    }
  }
`;

/**
 *
 */
export interface GetRecordHistoryByIdResponse {
  loading: boolean;
  recordHistory: RecordHistory;
}
