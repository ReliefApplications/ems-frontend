import gql from 'graphql-tag';
import { Form } from '@safe/builder';

// === GET FORM BY ID ===
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
    }
  }
`;

export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}
