import { gql } from 'apollo-angular';
import { Setting, ApiConfiguration } from '@safe/builder';

// === GET SETTING ===
/** Get settings gql query definition */
export const GET_SETTING = gql`
  query GetSetting {
    setting {
      userManagement {
        local
        apiConfiguration {
          id
          name
        }
        serviceAPI
        attributesMapping
      }
    }
  }
`;

/** Get settings gql query response interface */
export interface GetSettingQueryResponse {
  loading: boolean;
  setting: Setting;
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
