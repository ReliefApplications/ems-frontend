import gql from 'graphql-tag';
import { Dashboard } from '@safe/builder';

// === GET DASHBOARD BY ID ===
/** Get dashboard query */
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    dashboard(id: $id) {
      id
      name
      structure
    }
  }
`;

/** Get dashboard query response */
export interface GetDashboardByIdQueryResponse {
  dashboard: Dashboard;
}
