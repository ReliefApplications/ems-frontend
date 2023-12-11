import { gql } from 'apollo-angular';

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
