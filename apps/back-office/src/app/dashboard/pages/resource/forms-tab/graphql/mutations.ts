import { gql } from 'apollo-angular';

/** Delete form gql mutation definition */
export const DELETE_FORM = gql`
  mutation deleteForm($id: ID!) {
    deleteForm(id: $id) {
      id
    }
  }
`;
