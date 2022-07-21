import { gql } from 'apollo-angular';
import { Dashboard } from '@safe/builder';

// === ADD DASHBOARD ===
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

export interface AddDashboardMutationResponse {
  loading: boolean;
  addDashboard: Dashboard;
}

// === DELETE DASHBOARD ===
export const DELETE_DASHBOARD = gql`
  mutation deleteDashboard($id: ID!) {
    deleteDashboard(id: $id) {
      id
      name
    }
  }
`;

export interface DeleteDashboardMutationResponse {
  loading: boolean;
  deleteDashboard: Dashboard;
}
