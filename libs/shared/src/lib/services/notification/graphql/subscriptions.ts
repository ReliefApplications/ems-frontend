import { gql } from 'apollo-angular';

/** Graphql request for listening to notifications */
export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription NotificationSubscription {
    notification {
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
      user {
        id
      }
      seenBy {
        id
        name
      }
    }
  }
`;
