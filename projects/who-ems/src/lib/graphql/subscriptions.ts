import gql from 'graphql-tag';
import { Notification } from '../models/notification.model';
import { Record } from '../models/record.model';

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
            global
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
