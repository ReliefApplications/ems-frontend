import { gql } from 'apollo-angular';
import { Notification } from '../../../models/notification.model';

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
      seenBy {
        id
        name
      }
    }
  }
`;

/** Model for NotificationSubscriptionResponse object */
export interface NotificationSubscriptionResponse {
  notification: Notification;
}
