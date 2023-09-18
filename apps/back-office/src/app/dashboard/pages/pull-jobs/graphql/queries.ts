import { gql } from 'apollo-angular';
import { PullJob, Application, Form, ApiConfiguration } from '@oort-front/shared';

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

// === GET FORMS ===
/** Graphql query for getting form names */
export const GET_FORM_NAMES = gql`
  query GetFormNames(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    forms(
      first: $first
      afterCursor: $afterCursor
      sortField: $sortField
      filter: $filter
    ) {
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

/** Model for GetFormsQueryResposne object */
export interface GetFormsQueryResponse {
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

/** Model for getFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  form: Form;
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
