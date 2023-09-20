import { gql } from 'apollo-angular';
import { Form } from '@oort-front/shared';

/** Delete form gql mutation definition */
export const DELETE_FORM = gql`
  mutation deleteForm($id: ID!) {
    deleteForm(id: $id) {
      id
    }
  }
`;

/** Delete form gql mutation response interface */
export interface DeleteFormMutationResponse {
  deleteForm: Form;
}
