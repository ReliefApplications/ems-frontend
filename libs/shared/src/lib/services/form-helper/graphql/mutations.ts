import { gql } from 'apollo-angular';

/** Graphql request for adding a new draft record to a form */
export const ADD_DRAFT_RECORD = gql`
  mutation addRecord($form: ID!, $data: JSON!, $display: Boolean) {
    addRecord(form: $form, data: $data, draft: true) {
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

/** Graphql request for editing a draft record by its id */
export const EDIT_DRAFT_RECORD = gql`
  mutation editRecord($id: ID!, $data: JSON) {
    editRecord(id: $id, data: $data) {
      id
      incrementalId
      draft
      data
      createdAt
      createdBy {
        name
      }
    }
  }
`;

/** Delete draft record gql mutation definition */
export const DELETE_DRAFT_RECORD = gql`
  mutation deleteRecord($id: ID!) {
    deleteRecord(id: $id, hardDelete: true) {
      id
    }
  }
`;
