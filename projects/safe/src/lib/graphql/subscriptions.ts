import { gql } from 'apollo-angular';
import { Notification } from '../models/notification.model';
import { Application } from '../models/application.model';

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

/** Graphql request  for listening to unlocking of applications */
export const APPLICATION_UNLOCKED_SUBSCRIPTION = gql`
  subscription applicationUnlocked($id: ID!) {
    applicationUnlocked(id: $id) {
      id
      locked
      lockedByUser
    }
  }
`;

/** Graphql request for listening to editing of applications */
export const APPLICATION_EDITED_SUBSCRIPTION = gql`
  subscription applicationEdited($id: ID!) {
    applicationEdited(id: $id) {
      id
      name
      description
      createdAt
      status
      canSee
      canUpdate
      lockedBy {
        id
        name
      }
    }
  }
`;

/** Model for ApplicationUnlockedSubscriptionResponse object */
export interface ApplicationUnlockedSubscriptionResponse {
  applicationUnlocked: Application;
}
/** Model for ApplicationEditeSubscriptionResponse obejct */
export interface ApplicationEditedSubscriptionResponse {
  applicationEdited: Application;
}
