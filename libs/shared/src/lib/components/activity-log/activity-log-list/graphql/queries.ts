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
    $sortField: String
    $sortOrder: String
  ) {
    activityLogs(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      userId: $userId
      applicationId: $applicationId
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
          title
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
