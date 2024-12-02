import { gql } from 'apollo-angular';

/**
 * GraphQL query to list all activities.
 */
export const LIST_ACTIVITIES = gql`
  query ListActivities($first: Int, $afterCursor: ID, $filter: JSON) {
    activityLogs(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          userId
          eventType
          url
          metadata
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
