import { gql } from 'apollo-angular';

// === ADD FORM ===
/** Add form gql mutation definition */
export const ADD_FORM = gql`
  mutation addForm(
    $name: String!
    $resource: ID
    $template: ID
    $apiConfiguration: ID
    $kobo: String
  ) {
    addForm(
      name: $name
      resource: $resource
      template: $template
      apiConfiguration: $apiConfiguration
      kobo: $kobo
    ) {
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

// === DELETE FORM ===
/** Delete form gql mutation definition */
export const DELETE_FORM = gql`
  mutation deleteForm($id: ID!) {
    deleteForm(id: $id) {
      id
    }
  }
`;
