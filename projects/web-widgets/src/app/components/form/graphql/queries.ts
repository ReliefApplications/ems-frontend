import gql from 'graphql-tag';
import { Form } from '@safe/builder';

// === GET FORM BY ID ===
/** Get form query */
export const GET_SHORT_FORM_BY_ID = gql`
  query GetShortFormById($id: ID!) {
    form(id: $id) {
      id
      name
      structure
      fields
      status
      canCreateRecords
      uniqueRecord {
        id
        modifiedAt
        data
      }
      canUpdate
      metadata
    }
  }
`;

/** Get form query response */
export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}
