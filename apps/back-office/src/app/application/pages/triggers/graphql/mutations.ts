import { gql } from 'apollo-angular';

/** Edit Resource triggers filters mutation */
export const EDIT_RESOURCE_TRIGGERS_FILTERS = gql`
  mutation editResource($id: ID!, $triggersFilters: JSON, $application: ID!) {
    editResource(id: $id, triggersFilters: $triggersFilters) {
      id
      name
      customNotifications(application: $application) {
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
      }
    }
  }
`;
