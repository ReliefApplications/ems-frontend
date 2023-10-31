import { gql } from 'apollo-angular';

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

// === ADD DRAFT RECORD ===

/** Graphql request for adding a new draft record to a form */
export const ADD_DRAFT_RECORD = gql`
  mutation addDraftRecord($form: ID!, $data: JSON!, $display: Boolean) {
    addDraftRecord(form: $form, data: $data) {
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

// === EDIT DRAFT RECORD ===

/** Graphql request for editing a draft record by its id */
export const EDIT_DRAFT_RECORD = gql`
  mutation editDraftRecord($id: ID!, $data: JSON) {
    editDraftRecord(id: $id, data: $data) {
      id
      data
      createdAt
      createdBy {
        name
      }
    }
  }
`;
