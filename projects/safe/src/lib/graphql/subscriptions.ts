import {gql} from 'apollo-angular';

import { Notification } from '../models/notification.model';
import { Record } from '../models/record.model';
import { Application } from '../models/application.model';

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
}`;

export interface NotificationSubscriptionResponse {
    notification: Notification;
}

export const RECORD_ADDED_SUBSCRIPTION = gql`
subscription RecordAddedSubscription($resource: ID, $form: ID) {
    recordAdded(resource: $resource, form: $form) {
        id
        data(display: true)
    }
}`;

export interface RecordAddedSubscriptionResponse {
    recordAdded: Record;
}

export const APPLICATION_UNLOCKED_SUBSCRIPTION = gql`
  subscription applicationUnlocked($application: ID!, $lockedByID: ID!){
    applicationUnlocked(application: $application, lockedByID: $lockedByID){
      id
      name
      description
      createdAt
      status
      canSee
      canUpdate
      isLocked
      isLockedBy {
        id
        name
      }
    }
  }
`;

export interface ApplicationUnlockedSubscriptionResponse {
    applicationUnlocked: Application;
}
