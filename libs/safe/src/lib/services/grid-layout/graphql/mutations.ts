import { gql } from 'apollo-angular';

// === ADD LAYOUT ===

/** Graphql request for adding a new layout with a given type */
export const ADD_LAYOUT = gql`
  mutation addLayout($resource: ID, $form: ID, $layout: LayoutInputType!) {
    addLayout(resource: $resource, form: $form, layout: $layout) {
      id
      name
      createdAt
      query
      display
    }
  }
`;

// === EDIT LAYOUT ===

/** Grahql request for editing a layout by its id */
export const EDIT_LAYOUT = gql`
  mutation editLayout(
    $resource: ID
    $form: ID
    $layout: LayoutInputType!
    $id: ID!
  ) {
    editLayout(resource: $resource, form: $form, layout: $layout, id: $id) {
      id
      name
      createdAt
      query
      display
    }
  }
`;

// === DELETE LAYOUT ===

/** Graphql request for deleting a layout by its id */
export const DELETE_LAYOUT = gql`
  mutation deleteLayout($resource: ID, $form: ID, $id: ID!) {
    deleteLayout(resource: $resource, form: $form, id: $id) {
      id
      name
      createdAt
    }
  }
`;
