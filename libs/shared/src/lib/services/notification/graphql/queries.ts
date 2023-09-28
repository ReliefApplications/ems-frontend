import { gql } from 'apollo-angular';

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
