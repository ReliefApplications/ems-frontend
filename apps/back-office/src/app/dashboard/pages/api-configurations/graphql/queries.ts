import { gql } from 'apollo-angular';

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
