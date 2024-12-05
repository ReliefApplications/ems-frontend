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

/** GraphQL query to group activities by url */
export const LIST_ACTIVITIES_BY_URL = gql`
  query ListActivitiesByUrl($first: Int, $afterCursor: ID, $filter: JSON) {
    activityLogsByUrl(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
    ) {
      edges {
        node {
          url
          count
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
