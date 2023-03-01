import gql from 'graphql-tag';
import { Dashboard } from '@oort-front/safe';

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
