import { gql } from 'apollo-angular';
import { Form } from '@oort-front/shared';

// === ADD FORM ===
/** Add form gql mutation */
export const ADD_FORM = gql`
  mutation addForm($name: String!, $resource: ID, $template: ID) {
    addForm(name: $name, resource: $resource, template: $template) {
      id
      name
      createdAt
      status
      versions {
        id
      }
    }
  }
`;

/** Add form gql mutation response interface */
export interface AddFormMutationResponse {
  addForm: Form;
}
