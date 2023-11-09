import { gql } from 'apollo-angular';

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

/** Delete draft record gql mutation definition */
export const DELETE_DRAFT_RECORD = gql`
  mutation deleteDraftRecord($id: ID!) {
    deleteDraftRecord(id: $id) {
      id
    }
  }
`;
