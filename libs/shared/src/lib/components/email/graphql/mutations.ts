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

/**
 * GraphQL mutation to add configuration.
 */
export const ADD_CONFIGURATION = gql`
  mutation addConfiguration($resource: ID) {
    addConfiguration(resource: $resource) {
      id
      name
      schedule
      notificationType
      datasets
      emailLayout
      recipients
      lastExecution
      createdAt
      modifiedAt
      status
      recipientsType
    }
  }
`;
