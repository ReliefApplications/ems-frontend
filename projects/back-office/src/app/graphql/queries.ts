import { gql } from 'apollo-angular';
import {
  Dashboard,
  Form,
  Permission,
  Resource,
  Role,
  User,
  Record,
  Application,
  Page,
  Workflow,
  Step,
  PositionAttribute,
  ApiConfiguration,
  PullJob,
} from '@safe/builder';

// === GET USERS ===
/** Graphql query for getting users */
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
  }
`;

/** Model for GetUsersQueryResponse object */
export interface GetUsersQueryResponse {
  loading: boolean;
  users: User[];
}

// === GET ROLES ===
/** Graphql query for getting roles (of an application or all) */
export const GET_ROLES = gql`
  query GetRoles($all: Boolean, $application: ID) {
    roles(all: $all, application: $application) {
      id
      title
      permissions {
        id
        type
      }
      usersCount
      application {
        name
      }
    }
  }
`;

/** Model for GetRolesQueryResponse object */
export interface GetRolesQueryResponse {
  loading: boolean;
  roles: Role[];
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

// === GET DASHBOARDS ===
/** Graphql request for getting dashboards */
export const GET_DASHBOARDS = gql`
  {
    dashboards {
      id
      name
      createdAt
      structure
      canDelete
    }
  }
`;

/** Model for GetDashboardsQueryResponse object */
export interface GetDashboardsQueryResponse {
  loading: boolean;
  dashboards: Dashboard[];
}

// === GET FORMS ===
/** Graphql query for getting form names */
export const GET_FORM_NAMES = gql`
  query GetFormNames($first: Int, $afterCursor: ID) {
    forms(first: $first, afterCursor: $afterCursor) {
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

/** Graphql query for getting forms with minimum details */
export const GET_SHORT_FORMS = gql`
  query GetShortForms($first: Int, $afterCursor: ID, $filter: JSON) {
    forms(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          name
          createdAt
          status
          versionsCount
          recordsCount
          core
          canSee
          canCreateRecords
          canUpdate
          canDelete
          resource {
            id
            coreForm {
              id
              name
            }
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

/** Model for GetFormsQueryResposne object */
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

// === GET FORM BY ID ===
/** Graphql query for getting a form with minimum details by id */
export const GET_SHORT_FORM_BY_ID = gql`
  query GetShortFormById($id: ID!) {
    form(id: $id) {
      id
      name
      core
      structure
      fields
      status
      canCreateRecords
      uniqueRecord {
        id
        modifiedAt
        data
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

/** Graphql query for getting a form by its id */
export const GET_FORM_BY_ID = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      name
      createdAt
      structure
      fields
      status
      versions {
        id
        createdAt
        data
      }
      canUpdate
    }
  }
`;

/** Graphql request for getting the structure of a form by its id */
export const GET_FORM_STRUCTURE = gql`
  query GetFormStructure($id: ID!) {
    form(id: $id) {
      id
      structure
    }
  }
`;

/** Model for getFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}

/** Graphql query for getting the records of a form */
export const GET_FORM_RECORDS = gql`
  query GetFormRecords(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $filter: JSON
    $display: Boolean
    $showDeletedRecords: Boolean
  ) {
    form(id: $id) {
      records(
        first: $first
        afterCursor: $afterCursor
        filter: $filter
        archived: $showDeletedRecords
      ) {
        edges {
          node {
            id
            incrementalId
            data(display: $display)
            versions {
              id
              createdAt
              data
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

/** Model for GetFormRecordsQueryResponse */
export interface GetFormRecordsQueryResponse {
  loading: boolean;
  form: {
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

// === GET RESOURCE BY ID ===
/** Graphq query for getting a resource by its id */
export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      createdAt
      fields
      layouts {
        id
        name
        createdAt
        query
        display
      }
      forms {
        id
        name
        status
        createdAt
        recordsCount
        core
        canUpdate
        canDelete
        canCreateRecords
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

/** Graphql query for getting records of a resource */
export const GET_RESOURCE_RECORDS = gql`
  query GetResourceRecords(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $filter: JSON
    $display: Boolean
    $showDeletedRecords: Boolean
  ) {
    resource(id: $id) {
      records(
        first: $first
        afterCursor: $afterCursor
        filter: $filter
        archived: $showDeletedRecords
      ) {
        edges {
          node {
            id
            incrementalId
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

/** Model for GetResourceRecordsQueryResponse object */
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

// === GET RESOURCES ===
/** Graphql query for getting multiple resources with a cursor */
export const GET_RESOURCES = gql`
  query GetResources($first: Int, $afterCursor: ID) {
    resources(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          forms {
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

/** Graphql query for getting resources with a filter and more data */
export const GET_RESOURCES_EXTENDED = gql`
  query GetResourcesExtended($first: Int, $afterCursor: ID, $filter: JSON) {
    resources(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          name
          createdAt
          recordsCount
          canDelete
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
      createdAt
      modifiedAt
      createdBy {
        name
      }
      modifiedBy {
        name
      }
      data
      form {
        id
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

// === GET DASHBOARD BY ID ===
/** Graphql query for getting a dashboard by its id */
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

// === GET APPLICATIONS ===
/** Graphql query for getting multiple applications with a cursor */
export const GET_APPLICATIONS = gql`
  query GetApplications($first: Int, $afterCursor: ID, $filter: JSON) {
    applications(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          name
          createdAt
          modifiedAt
          status
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
          usersCount
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

// === GET APPLICATION BY ID ===

/** Graphql query for getting an application by its id */
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
      isLocked
    }
  }
`;

/** Model for GetApplicationByIdQueryResponse object */
export interface GetApplicationByIdQueryResponse {
  loading: boolean;
  application: Application;
}

// === GET PAGE BY ID ===

/** Graphql query for getting a page data by its id */
export const GET_PAGE_BY_ID = gql`
  query GetPageById($id: ID!) {
    page(id: $id) {
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

/** Model for GetPagesByIdQueryResponse object */
export interface GetPageByIdQueryResponse {
  loading: boolean;
  page: Page;
}

// === GET WORKFLOW BY ID ===

/** Graphql query for getting a workflow by its id */
export const GET_WORKFLOW_BY_ID = gql`
  query GetWorkflowById($id: ID!, $asRole: ID) {
    workflow(id: $id, asRole: $asRole) {
      id
      name
      createdAt
      modifiedAt
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

// === GET STEP BY ID ===

/** Graphql query for getting a step by its id */
export const GET_STEP_BY_ID = gql`
  query GetStepById($id: ID!) {
    step(id: $id) {
      id
      name
      createdAt
      modifiedAt
      content
      workflow {
        id
        name
        page {
          id
          application {
            id
          }
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
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Model for GetStepByIdQueryResponse object */
export interface GetStepByIdQueryResponse {
  loading: boolean;
  step: Step;
}

// === GET ROUTING KEYS ===

/** Graphql query for getting routing keys with a cursor */
export const GET_ROUTING_KEYS = gql`
  query GetRoutingKeys($first: Int, $afterCursor: ID) {
    applications(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          channels {
            id
            title
            routingKey
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

/** Model for GetRoutingKeysQueryResponse object */
export interface GetRoutingKeysQueryResponse {
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

// === GET POSITION ATTRIBUTES FORM CATEGORY ===

/** Graphql query for getting the position attributes from their category */
export const GET_POSITION_ATTRIBUTES_FROM_CATEGORY = gql`
  query GetPositionAttributesFromCategory($id: ID!) {
    positionAttributes(category: $id) {
      value
      category {
        title
      }
      usersCount
    }
  }
`;

/** Model for GetPositionAttributesFromCategoryQueryResponse object */
export interface GetPositionAttributesFromCategoryQueryResponse {
  loading: boolean;
  positionAttributes: PositionAttribute[];
}

// === GET RECORD DETAILS ===

/** Graphql query for getting all details of a record by its id */
export const GET_RECORD_DETAILS = gql`
  query GetRecordDetails($id: ID!) {
    record(id: $id) {
      id
      data
      createdAt
      modifiedAt
      form {
        id
        name
        createdAt
        structure
        fields
        core
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

// === GET API CONFIGURATIONS ===

/** Graphql query for getting multiple api configurations object with a cursor */
export const GET_API_CONFIGURATIONS = gql`
  query GetApiConfigurations($first: Int, $afterCursor: ID) {
    apiConfigurations(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          status
          authType
          endpoint
          pingUrl
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

/** Model for GetApiConfigurationQueryResponse object */
export interface GetApiConfigurationsQueryResponse {
  loading: boolean;
  apiConfigurations: {
    edges: {
      node: ApiConfiguration;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

// === GET API CONFIGURATION ===

/** Graphql query for getting an api configuration by its id */
export const GET_API_CONFIGURATION = gql`
  query GetApiConfiguration($id: ID!) {
    apiConfiguration(id: $id) {
      id
      name
      status
      authType
      endpoint
      pingUrl
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
  }
`;

/** Modelf for GetApiConfigurationQueryResponse object */
export interface GetApiConfigurationQueryResponse {
  loading: boolean;
  apiConfiguration: ApiConfiguration;
}

// === GET PULL JOBS ===

/** Graphql queryfor getting multiple pull job objects with a cursor */
export const GET_PULL_JOBS = gql`
  query GetPullJobs($first: Int, $afterCursor: ID) {
    pullJobs(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          status
          apiConfiguration {
            id
            name
            authType
          }
          url
          path
          schedule
          convertTo {
            id
            name
          }
          mapping
          uniqueIdentifiers
          channel {
            id
            title
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

/** Model for GetPullJobsQueryResponse object */
export interface GetPullJobsQueryResponse {
  loading: boolean;
  pullJobs: {
    edges: {
      node: PullJob;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}
