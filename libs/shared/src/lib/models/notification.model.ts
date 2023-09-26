import { Channel } from './channel.model';
import { GraphqlNodesResponse } from './graphql-query.model';
import { User } from './user.model';

/**
 * Model for Notification object
 */
export interface Notification {
  id?: string;
  action?: string;
  content?: any;
  createdAt?: Date;
  channel?: Channel;
  seenBy?: User[];
}

/** Model for notification subscription response */
export interface NotificationSubscriptionResponse {
  notification: Notification;
}

/** Model for notifications nodes query response object */
export interface NotificationsQueryResponse {
  notifications: GraphqlNodesResponse<Notification>;
}

/** Model for publish mutation response */
export interface PublishMutationResponse {
  publish: boolean;
}

/** Model for publish notification mutation response */
export interface PublishNotificationMutationResponse {
  publishNotification: Notification;
}

/** Model for see notification mutation response */
export interface SeeNotificationMutationResponse {
  seeNotification: Notification;
}

/** Model for see notifications mutation response */
export interface SeeNotificationsMutationResponse {
  seeNotifications: boolean;
}
