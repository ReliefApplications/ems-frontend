import { gql } from 'apollo-angular';

/**
 * GraphQL query to list all activities.
 */
export const LIST_ACTIVITIES = gql`
  query ListActivities($userId: String, $applicationId: String) {
    activityLogs(userId: $userId, applicationId: $applicationId) {
      userId
      applicationId
      eventType
      url
      metadata
    }
  }
`;
