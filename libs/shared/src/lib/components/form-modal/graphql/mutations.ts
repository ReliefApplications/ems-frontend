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

// === ADD RECORD ===
/** Graphql request for adding a new record to a form */
export const ADD_RECORD = gql`
  mutation addRecord($form: ID!, $data: JSON!, $display: Boolean) {
    addRecord(form: $form, data: $data) {
      id
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
      data
      createdAt
      modifiedAt
    }
  }
`;

/** Graphql request for archiving a record by its id */
export const ARCHIVE_RECORD = gql`
  mutation ArchiveRecord($id: ID!) {
    deleteRecord(id: $id, hardDelete: false) {
      id
    }
  }
`;
