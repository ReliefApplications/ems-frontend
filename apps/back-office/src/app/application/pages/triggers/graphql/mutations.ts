import { gql } from 'apollo-angular';

/** Edit triggers filters mutation */
export const EDIT_CUSTOM_NOTIFICATION_FILTERS = gql`
  mutation editCustomNotification(
    $application: ID!
    $id: ID!
    $triggersFilters: JSON
  ) {
    editCustomNotification(
      application: $application
      id: $id
      triggersFilters: $triggersFilters
    ) {
      id
      name
      description
      schedule
      notificationType
      resource
      layout
      template
      recipients
      recipientsType
      status
      onRecordCreation
      onRecordUpdate
      applicationTrigger
      redirect
      filter
    }
  }
`;
