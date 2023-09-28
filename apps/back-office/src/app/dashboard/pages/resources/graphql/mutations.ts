import { gql } from 'apollo-angular';

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

// == DELETE RESOURCE ==
/** Delete resource gql mutation definition */
export const DELETE_RESOURCE = gql`
  mutation deleteResource($id: ID!) {
    deleteResource(id: $id) {
      id
    }
  }
`;
