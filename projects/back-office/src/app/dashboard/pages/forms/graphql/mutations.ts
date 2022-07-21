import { gql } from 'apollo-angular';
import { Form } from '@safe/builder';

// === ADD FORM ===
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

export interface AddFormMutationResponse {
  loading: boolean;
  addForm: Form;
}

// === DELETE FORM ===
export const DELETE_FORM = gql`
  mutation deleteForm($id: ID!) {
    deleteForm(id: $id) {
      id
    }
  }
`;

export interface DeleteFormMutationResponse {
  loading: boolean;
  deleteForm: Form;
}
