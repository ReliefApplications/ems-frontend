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
    $draft: Boolean
    $updateDraftStatus: Boolean
    $skipValidation: Boolean
  ) {
    editRecord(
      id: $id
      data: $data
      version: $version
      template: $template
      lang: $lang
      draft: $draft
      updateDraftStatus: $updateDraftStatus
      skipValidation: $skipValidation
    ) {
      id
      incrementalId
      draft
      data(display: $display)
      createdAt
      modifiedAt
      createdBy {
        name
      }
      validationErrors {
        question
        errors
        severity
        matches {
          id
          incrementalId
        }
        hiddenMatchCount
      }
    }
  }
`;

// === ADD RECORD ===
/** Graphql request for adding a new record to a form */
export const ADD_RECORD = gql`
  mutation addRecord(
    $form: ID!
    $data: JSON!
    $display: Boolean
    $draft: Boolean
    $cloneRecordId: ID
    $skipValidation: Boolean
  ) {
    addRecord(
      form: $form
      data: $data
      draft: $draft
      cloneRecordId: $cloneRecordId
      skipValidation: $skipValidation
    ) {
      id
      incrementalId
      draft
      createdAt
      modifiedAt
      createdBy {
        name
      }
      data(display: $display)
      form {
        uniqueRecord {
          id
          modifiedAt
          createdBy {
            name
          }
          data
        }
      }
      validationErrors {
        question
        errors
        severity
        matches {
          id
          incrementalId
        }
        hiddenMatchCount
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
    editRecords(ids: $ids, data: $data, template: $template, lang: $lang) {
      id
      incrementalId
      data
      createdAt
      modifiedAt
      validationErrors {
        question
        errors
      }
    }
  }
`;
