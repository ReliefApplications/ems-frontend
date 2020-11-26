import gql from 'graphql-tag';
import { Notification } from '../models/notification.model';

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
