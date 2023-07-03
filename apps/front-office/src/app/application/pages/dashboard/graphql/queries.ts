import { gql } from 'apollo-angular';
import { Dashboard } from '@oort-front/safe';

/**
 * Dashboard query.
 */
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    dashboard(id: $id) {
      id
      name
      createdAt
      structure
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      buttons
      canSee
      canUpdate
      showFilter
      page {
        id
        visible
        application {
          id
        }
        canUpdate
        context
        content
        contentWithContext
      }
    }
  }
`;

/**
 * Interface of dashboard query response.
 */
export interface GetDashboardByIdQueryResponse {
  /** Loading state of the query */

  /** Application dashboard */
  dashboard: Dashboard;
}
