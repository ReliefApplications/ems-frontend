import { gql } from 'apollo-angular';

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

// === EDIT RECORDS ===

/** Graphql request for editing multiple records by their ids */
export const EDIT_RECORDS = gql`
  mutation editRecords(
    $ids: [ID]!
    $data: JSON!
    $template: ID
    $lang: String
  ) {
    editRecords(
      ids: $ids
      data: $data
      template: $template
      lang: $lang
      skipValidation: true
    ) {
      id
      data
      createdAt
      modifiedAt
    }
  }
`;

// === PUBLISH RECORDS ===

/** Graphql request for publishing rows to a channel */
export const PUBLISH = gql`
  mutation publish($ids: [ID]!, $channel: ID!) {
    publish(ids: $ids, channel: $channel)
  }
`;

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
