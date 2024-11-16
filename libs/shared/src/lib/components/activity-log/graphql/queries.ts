import { gql } from 'apollo-angular';

/**
 * GraphQL query to list all activities.
 */
export const LIST_ACTIVITIES = gql`
  query ListActivities {
    activity {
      userId
      eventType
      url
      metadata
    }
  }
`;
