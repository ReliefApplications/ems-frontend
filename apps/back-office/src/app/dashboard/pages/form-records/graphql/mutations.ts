import { gql } from 'apollo-angular';

// === RESTORE RECORD ===
/** Restore record gql mutation definition */
export const RESTORE_RECORD = gql`
  mutation restoreRecord($id: ID!) {
    restoreRecord(id: $id) {
      id
    }
  }
`;

// === DELETE RECORD ===
/** Delete record gql mutation definition */
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!, $hardDelete: Boolean) {
    deleteRecord(id: $id, hardDelete: $hardDelete) {
      id
    }
  }
`;

// === EDIT RECORD ===
/** Edit record gql mutation definition */
export const EDIT_RECORD = gql`
  mutation editRecord($id: ID!, $data: JSON, $version: ID, $display: Boolean) {
    editRecord(id: $id, data: $data, version: $version) {
      id
      data(display: $display)
      createdAt
      modifiedAt
      createdBy {
        name
      }
    }
  }
`;
