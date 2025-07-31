import { gql } from 'apollo-angular';

/**
 * Form query.
 */
export const GET_FORM_BY_ID = gql`
  query GetForm($id: ID!) {
    form(id: $id) {
      id
      name
      canCreateRecords
    }
  }
`;
