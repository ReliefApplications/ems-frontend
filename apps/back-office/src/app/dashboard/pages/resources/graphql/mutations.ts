import { gql } from 'apollo-angular';
import { Resource, Form } from '@oort-front/safe';

// === ADD FORM ===
/** Add form gql mutation definition */
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

// == DELETE RESOURCE ==
/** Delete resource gql mutation definition */
export const DELETE_RESOURCE = gql`
  mutation deleteResource($id: ID!) {
    deleteResource(id: $id) {
      id
    }
  }
`;

/** Delete resource gql mutation response interface */
export interface DeleteResourceMutationResponse {
  deletedResource: Resource;
}

// == DUPLICATE RESOURCE ==
/** Duplicate resource gql mutation definition */
export const DUPLICATE_RESOURCE = gql`
  mutation duplicateResource($id: ID!) {
    duplicateResource(id: $id) {
      id
    }
  }
`;

/** Duplicate resource gql mutation response interface */
export interface DuplicateResourceMutationResponse {
  duplicatedResource: Resource;
}
