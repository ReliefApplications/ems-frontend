import { gql } from 'apollo-angular';
import { CustomNotification } from '../../../models/custom-notification.model';

/**
 * Get Custom notifications of current application.
 */
export const GET_CUSTOM_NOTIFICATIONS = gql`
  query GetCustomNotifications(
    $application: ID!
    $first: Int
    $afterCursor: ID
  ) {
    application(id: $application) {
      customNotifications(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
            id
            name
            status
            lastExecution
            schedule
            resource
            notificationType
            recipients
            template
            layout
            description
            recipientsType
          }
          cursor
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/** Interface of GET_CUSTOM_NOTIFICATIONS query response */
export interface GetCustomNotificationsQueryResponse {
  application: {
    customNotifications: {
      edges: {
        node: CustomNotification;
        cursor: string;
      }[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      totalCount: number;
    };
  };
}
