import gql from 'graphql-tag';
import { Dashboard } from '@safe/builder';

// === GET DASHBOARD BY ID ===
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    dashboard(id: $id) {
      id
      name
      structure
    }
  }
`;

export interface GetDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}
