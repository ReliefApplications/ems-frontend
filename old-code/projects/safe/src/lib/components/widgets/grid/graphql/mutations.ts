import { gql } from 'apollo-angular';
import { Notification } from '../../../../models/notification.model';
import { Record } from '../../../../models/record.model';

// === EDIT RECORD ===

/** Graphql request for editing a record by its id */
export const EDIT_RECORD = gql`
  mutation editRecord(
    $id: ID!
    $data: JSON
    $version: ID
    $template: ID
    $display: Boolean
    $lang: String
  ) {
    editRecord(
      id: $id
      data: $data
      version: $version
      template: $template
      lang: $lang
    ) {
      id
      incrementalId
      data(display: $display)
      createdAt
      modifiedAt
      createdBy {
        name
      }
      validationErrors {
        question
        errors
      }
    }
  }
`;

/** Model for EditRecordMutationResponse object */
export interface EditRecordMutationResponse {
  editRecord: Record;
}

// === EDIT RECORDS ===

/** Graphql request for editing multiple records by their ids */
export const EDIT_RECORDS = gql`
  mutation editRecords(
    $ids: [ID]!
    $data: JSON!
    $template: ID
    $lang: String
  ) {
    editRecords(ids: $ids, data: $data, template: $template, lang: $lang) {
      id
      data
      createdAt
      modifiedAt
    }
  }
`;

/** Model for EditRecordsMutationResponse object */
export interface EditRecordsMutationResponse {
  editRecords: Record[];
}

// === PUBLISH RECORDS ===

/** Graphql request for publishing rows to a channel */
export const PUBLISH = gql`
  mutation publish($ids: [ID]!, $channel: ID!) {
    publish(ids: $ids, channel: $channel)
  }
`;

/** Model for PublishMutationResponse object */
export interface PublishMutationResponse {
  publish: boolean;
}

// === PUBLISH NOTIFICATION ===

/** Graphql request for publishing a new notification onto a a channel */
export const PUBLISH_NOTIFICATION = gql`
  mutation publishNotification(
    $action: String!
    $content: JSON!
    $channel: ID!
  ) {
    publishNotification(action: $action, content: $content, channel: $channel) {
      id
      action
      content
      createdAt
      channel {
        id
        title
        application {
          id
          name
        }
      }
      seenBy {
        id
        username
      }
    }
  }
`;

/** Model for PublishNotificationMutationResponse object */
export interface PublishNotificationMutationResponse {
  publishNotification: Notification;
}
