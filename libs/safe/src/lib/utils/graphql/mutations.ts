import { gql } from 'apollo-angular';
import { Record } from '../../models/record.model';

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

/** Model for EditRecordsMutationResponse object */
export interface EditRecordsMutationResponse {
  editRecords: Record[];
}
