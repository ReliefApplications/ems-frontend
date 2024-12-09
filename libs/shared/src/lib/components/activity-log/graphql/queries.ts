import { gql } from 'apollo-angular';

/**
 * GraphQL query to list all activities.
 */
export const LIST_ACTIVITIES = gql`
  query ListActivities(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $userId: String
    $applicationId: String
  ) {
    activityLogs(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      userId: $userId
      applicationId: $applicationId
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
          createdAt
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
