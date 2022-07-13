import { gql } from 'apollo-angular';
import { Dashboard } from '@safe/builder';

/**
 * Get url needed info from an specific dashboard id
 */
export const GET_SHARE_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    dashboard(id: $id) {
      id
      page {
        application {
          id
        }
      }
      step {
        workflow {
          id
          page {
            application {
              id
            }
          }
        }
      }
    }
  }
`;

/**
 * Interface used by the GET_SHARE_DASHBOARD_BY_ID query
 */
export interface GetShareDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}
