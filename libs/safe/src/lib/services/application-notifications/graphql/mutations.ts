import { gql } from 'apollo-angular';
import { CustomNotification } from '../../../models/custom-notification.model';

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

/** Interface for ADD_CUSTOM_NOTIFICATION mutation response */
export interface AddCustomNotificationMutationResponse {
  addCustomNotification: CustomNotification;
}

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
      type
      content
    }
  }
`;

/** Interface for UPDATE_CUSTOM_NOTIFICATION mutation response */
export interface UpdateCustomNotificationMutationResponse {
  editCustomNotification: CustomNotification;
}

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

/** Interface for DELETE_CUSTOM_NOTIFICATION mutation response */
export interface DeleteCustomNotificationMutationResponse {
  deleteCustomNotification: CustomNotification;
}
