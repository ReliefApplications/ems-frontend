import { gql } from 'apollo-angular';
import { Notification } from '../../../models/notification.model';

// === SEE NOTIFICATION ===

/** Graphql request for marking a notification as seen */
export const SEE_NOTIFICATION = gql`
  mutation seeNotification($id: ID!) {
    seeNotification(id: $id) {
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

/** Model for SeeNotificationMutationResponse object */
export interface SeeNotificationMutationResponse {
  seeNotification: Notification;
}

// === SEE ALL NOTIFICATION ===

/** Graphql request for marking multiple notifications as seen */
export const SEE_NOTIFICATIONS = gql`
  mutation seeNotifications($ids: [ID]!) {
    seeNotifications(ids: $ids)
  }
`;

/** Model for SeeNotificationsMutationResponse object */
export interface SeeNotificationsMutationResponse {
  seeNotifications: boolean;
}
