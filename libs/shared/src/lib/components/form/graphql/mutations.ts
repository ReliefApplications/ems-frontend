import { gql } from 'apollo-angular';

/** Graphql request for adding a new record to a form */
export const ADD_RECORD = gql`
  mutation addRecord(
    $form: ID!
    $data: JSON!
    $display: Boolean
    $draft: Boolean
  ) {
    addRecord(form: $form, data: $data, draft: $draft) {
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
    }
  }
`;

/**
 * Graphql request for adding a new record to a public form, as an
 * unauthenticated user. Only checks that the record has been created, as
 * unauthenticated users cannot read the other record fields.
 */
export const ADD_RECORD_PUBLIC = gql`
  mutation addRecord($form: ID!, $data: JSON!, $captchaToken: String) {
    addRecord(form: $form, data: $data, captchaToken: $captchaToken) {
      id
    }
  }
`;

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
  ) {
    editRecord(
      id: $id
      data: $data
      version: $version
      template: $template
      lang: $lang
      draft: $draft
      updateDraftStatus: $updateDraftStatus
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
      }
    }
  }
`;
