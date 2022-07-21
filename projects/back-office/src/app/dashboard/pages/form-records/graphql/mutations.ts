import { gql } from 'apollo-angular';
import { Record } from '@safe/builder';

// === RESTORE RECORD ===
export const RESTORE_RECORD = gql`
  mutation restoreRecord($id: ID!) {
    restoreRecord(id: $id) {
      id
    }
  }
`;

export interface RestoreRecordMutationResponse {
  loading: boolean;
  restoreRecord: Record;
}

// === DELETE RECORD ===
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!, $hardDelete: Boolean) {
    deleteRecord(id: $id, hardDelete: $hardDelete) {
      id
    }
  }
`;

export interface DeleteRecordMutationResponse {
  loading: boolean;
  deleteRecord: Record;
}

// === EDIT RECORD ===
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

export interface EditRecordMutationResponse {
  loading: boolean;
  editRecord: Record;
}
