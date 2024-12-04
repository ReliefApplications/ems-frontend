import { gql } from 'apollo-angular';

/**
 * GraphQL query to list all activities.
 */
export const LIST_ACTIVITIES = gql`
  query ListActivities(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $sortField: String
    $sortOrder: String
  ) {
    activityLogs(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      edges {
        node {
          id
          userId
          username
          eventType
          url
          metadata
          attributes
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
