import { gql } from 'apollo-angular';

/** Graphql request for editing an application by its id  creat new mutation to dashboard here*/
export const EDIT_DASHBOARD_FILTER = gql`
  mutation editApplication($id: ID!, $filterStructure: JSON) {
    editApplication(id: $id, filterStructure: $filterStructure) {
      id
      filterStructure
    }
  }
`;

/** Graphql request for editing an application by its id */
export const EDIT_DASHBOARD_FILTER_POSITION = gql`
  mutation editApplication($id: ID!, $position: String) {
    editApplication(id: $id, position: $position) {
      id
      position
    }
  }
`;
