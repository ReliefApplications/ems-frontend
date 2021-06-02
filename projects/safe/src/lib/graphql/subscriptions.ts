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

export const APPLICATION_EDITED_SUBSCRIPTION = gql`
  subscription applicationEdited{
    applicationEdited{
      id
      name
      description
      createdAt
      status
      pages {
        id
        name
        type
        content
        createdAt
        canSee
        canUpdate
        canDelete
      }
      roles {
        id
        title
        permissions {
          id
          type
        }
        usersCount
      }
      users {
        id
        username
        name
        roles {
          id
          title
        }
        oid
      }
      permissions {
        canSee {
          id
          title
        }
        canCreate {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      canSee
      canUpdate
    }
  }
`;

export interface ApplicationEditedSubscriptionResponse {
    applicationEdited: Application;
}