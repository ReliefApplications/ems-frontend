import { gql } from 'apollo-angular';
import { Resource, Form } from '@safe/builder';

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

// == DELETE RESOURCE ==

export const DELETE_RESOURCE = gql`
  mutation deleteResource($id: ID!) {
    deleteResource(id: $id) {
      id
    }
  }
`;

export interface DeleteResourceMutationResponse {
  loading: boolean;
  deletedResource: Resource;
}
