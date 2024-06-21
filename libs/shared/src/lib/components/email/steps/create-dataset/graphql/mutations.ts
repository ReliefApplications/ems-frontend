import { gql } from 'apollo-angular';

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
