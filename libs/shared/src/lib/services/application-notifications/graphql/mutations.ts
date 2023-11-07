import { gql } from 'apollo-angular';

/** Graphql request for adding a notification to an application */
export const ADD_CUSTOM_NOTIFICATION = gql`
  mutation addCustomNotification(
    $application: ID!
    $notification: CustomNotificationInputType!
  ) {
    addCustomNotification(
      application: $application
      notification: $notification
    ) {
      id
    }
  }
`;

/** Graphql request for editing a notification of an application */
export const UPDATE_CUSTOM_NOTIFICATION = gql`
  mutation editCustomNotification(
    $application: ID!
    $id: ID!
    $notification: CustomNotificationInputType!
  ) {
    editCustomNotification(
      application: $application
      id: $id
      notification: $notification
    ) {
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
  }
`;

/** Graphql request for deleting a notification of an application */
export const DELETE_CUSTOM_NOTIFICATION = gql`
  mutation deleteCustomNotification($application: ID!, $id: ID!) {
    deleteCustomNotification(application: $application, id: $id) {
      id
      name
      type
      content
    }
  }
`;
