import { gql } from 'apollo-angular';
import { ApiConfiguration } from '@oort-front/shared';

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
      graphQLEndpoint
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
  apiConfiguration: ApiConfiguration;
}
