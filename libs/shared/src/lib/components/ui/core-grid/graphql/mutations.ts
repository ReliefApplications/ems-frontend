import { gql } from 'apollo-angular';
import { Record } from '../../../../models/record.model';

// === CONVERT RECORD ===

/** Graphql request for converting a record with its id and its form id */
export const CONVERT_RECORD = gql`
  mutation convertRecord($id: ID!, $form: ID!, $copyRecord: Boolean!) {
    convertRecord(id: $id, form: $form, copyRecord: $copyRecord) {
      id
      createdAt
      modifiedAt
    }
  }
`;

/** Model for ConvertRecordMutationResponse object */
export interface ConvertRecordMutationResponse {
  convertRecord: Record;
}
// === DELETE RECORD ===

/** Graphl request for deleting multiple records by their ids */
export const DELETE_RECORDS = gql`
  mutation deleteRecords($ids: [ID]!) {
    deleteRecords(ids: $ids)
  }
`;

/** Model for DeleteRecordsMutationResponse object */
export interface DeleteRecordsMutationResponse {
  deleteRecords: number;
}

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
  ) {
    editRecord(
      id: $id
      data: $data
      version: $version
      template: $template
      lang: $lang
      draft: $draft
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

/** Model for EditRecordMutationResponse object */
export interface EditRecordMutationResponse {
  editRecord: Record;
}
