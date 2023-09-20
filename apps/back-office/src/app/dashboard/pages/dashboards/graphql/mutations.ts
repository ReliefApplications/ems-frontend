import { gql } from 'apollo-angular';
import { Dashboard } from '@oort-front/shared';

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

/** Add dashboard gql mutation response interface */
export interface AddDashboardMutationResponse {
  addDashboard: Dashboard;
}

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

/** Delete dashboard gql mutation response interface */
export interface DeleteDashboardMutationResponse {
  deleteDashboard: Dashboard;
}
