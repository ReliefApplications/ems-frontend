import { gql } from 'apollo-angular';
import { Record } from '@oort-front/shared';

// === RESTORE RECORD ===
/** Restore record gql mutation definition */
export const RESTORE_RECORD = gql`
  mutation restoreRecord($id: ID!) {
    restoreRecord(id: $id) {
      id
    }
  }
`;

/** Restore record gql mutation response interface */
export interface RestoreRecordMutationResponse {
  restoreRecord: Record;
}

// === DELETE RECORD ===
/** Delete record gql mutation definition */
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!, $hardDelete: Boolean) {
    deleteRecord(id: $id, hardDelete: $hardDelete) {
      id
    }
  }
`;

/** Delete record gql mutation response interface */
export interface DeleteRecordMutationResponse {
  deleteRecord: Record;
}

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

/** Edit record gql mutation response interface */
export interface EditRecordMutationResponse {
  editRecord: Record;
}
