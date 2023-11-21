import { gql } from 'apollo-angular';

/** Graphql request for editing an application by its id  creat new mutation to dashboard here*/
export const EDIT_DASHBOARD_FILTER = gql`
  mutation editApplication($id: ID!, $contextualFilter: JSON) {
    editApplication(id: $id, contextualFilter: $contextualFilter) {
      id
      contextualFilter
    }
  }
`;

/** Graphql request for editing an application by its id */
export const EDIT_DASHBOARD_FILTER_POSITION = gql`
  mutation editApplication($id: ID!, $contextualFilterPosition: String) {
    editApplication(
      id: $id
      contextualFilterPosition: $contextualFilterPosition
    ) {
      id
      contextualFilterPosition
    }
  }
`;
