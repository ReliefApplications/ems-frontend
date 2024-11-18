import { gql } from 'apollo-angular';

/**
 * GraphQL query to list all activities.
 */
export const LIST_ACTIVITIES = gql`
  query ListActivities {
    activityLogs {
      userId
      eventType
      url
      metadata
    }
  }
`;
