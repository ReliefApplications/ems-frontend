import { GraphqlNodesResponse } from './graphql-query.model';

/**
 * Email notification type enum
 */
export const EMAIL_NOTIFICATION_TYPES = ['email', 'alert', 'push notification'];
export type EmailNotificationTypes = (typeof EMAIL_NOTIFICATION_TYPES)[number];

/**
 * Email notification item
 */
export interface EmailNotification {
  applicationId: string;
  createdAt: string;
  emailDistributionList: string;
  userSubscribed: boolean;
  subscriptionList: Array<any>;
  restrictSubscription: boolean;
  name: string;
  id: string;
  notificationType: EmailNotificationTypes;
  createdBy: {
    name: string;
    email: string;
  };
  isDraft: boolean;
  isDeleted: boolean;
  draftStepper: any;
  __typename: string;
}

/** Email notification query response interface */
export interface EmailNotificationQueryResponse {
  emailNotification: EmailNotification;
}

/** Model for email notification nodes graphql query response */
export interface EmailNotificationsQueryResponse {
  emailNotifications: GraphqlNodesResponse<EmailNotification>;
}

/** Model for email distribution lists nodes graphql query response */
export interface EmailDistributionListQueryResponse {
  emailDistributionLists: GraphqlNodesResponse<any>;
}

/** Model for email templates nodes graphql query response */
export interface EmailTemplatesQueryResponse {
  customTemplates: GraphqlNodesResponse<any>;
}
