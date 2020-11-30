import gql from 'graphql-tag';
import { Notification } from '../models/notification.model';
import { Record } from '../models/record.model';

export const NOTIFICATION_SUBSCRIPTION = gql`
subscription NotificationSubscription {
    notification {
        action
        content
        createdAt
    }
}`;

export interface NotificationSubscriptionResponse {
    notification: Notification;
}

export const RECORD_ADDED_SUBSCRIPTION = gql`
subscription RecordAddedSubscription($resource: ID) {
    recordAdded(resource: $resource) {
        id
        data(display: true)
    }
}`;

export interface RecordAddedSubscriptionResponse {
    recordAdded: Record;
}
