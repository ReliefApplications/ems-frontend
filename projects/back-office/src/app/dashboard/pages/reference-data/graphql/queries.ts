import { gql } from 'apollo-angular';
import { ReferenceData, ApiConfiguration } from '@safe/builder';

// === GET REFERENCE DATA ===
/** Get ref data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
      apiConfiguration {
        id
        name
      }
      type
      query
      fields
      valueField
      path
      data
      graphQLFilter
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

/** Get ref data gql query response interface */
export interface GetReferenceDataQueryResponse {
  loading: boolean;
  referenceData: ReferenceData;
}

/** Get API configuration gl query */
export const GET_API_CONFIGURATION = gql`
  query GetApiConfiguration($id: ID!) {
    apiConfiguration(id: $id) {
      id
      name
    }
  }
`;

/** Interface of API configuration gl query response */
export interface GetApiConfigurationQueryResponse {
  apiConfiguration: ApiConfiguration;
}

// === GET API CONFGIURATIONS NAME ===
/** API configuration names query */
export const GET_API_CONFIGURATIONS_NAMES = gql`
  query GetApiConfigurationsName($first: Int, $afterCursor: ID) {
    apiConfigurations(first: $first, afterCursor: $afterCursor) {
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
