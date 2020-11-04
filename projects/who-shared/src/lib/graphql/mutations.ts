import gql from 'graphql-tag';
import { Record } from '../models/record.model';

// === EDIT RECORD ===
export const EDIT_RECORD = gql`
mutation editRecord($id: ID!, $data: JSON!, $display: Boolean) {
  editRecord(id: $id, data: $data) {
    id
    data(display: $display)
    createdAt
    modifiedAt
  }
}`;

export interface EditRecordMutationResponse {
  loading: boolean;
  editRecord: Record;
}

// === ADD RECORD ===

export const ADD_RECORD = gql`
mutation addRecord($form: ID!, $data: JSON!, $display: Boolean) {
  addRecord(form: $form, data: $data) {
    id
    createdAt
    modifiedAt
    data(display: $display)
  }
}`;

export interface AddRecordMutationResponse {
  loading: boolean;
  addRecord: Record;
}
