import { gql } from 'apollo-angular';

// === ADD DASHBOARD ===
/** Add dashboard gql mutation definition */
export const ADD_DASHBOARD = gql`
  mutation addDashboard($name: String!) {
    addDashboard(name: $name) {
      id
      name
      structure
      createdAt
    }
  }
`;

// === DELETE DASHBOARD ===
/** Delete dashboard gql mutation definition */
export const DELETE_DASHBOARD = gql`
  mutation deleteDashboard($id: ID!) {
    deleteDashboard(id: $id) {
      id
      name
    }
  }
`;
