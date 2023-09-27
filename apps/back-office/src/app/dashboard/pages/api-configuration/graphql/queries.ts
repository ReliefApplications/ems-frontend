import { gql } from 'apollo-angular';

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
