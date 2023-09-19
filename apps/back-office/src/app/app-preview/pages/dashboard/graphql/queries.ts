import { gql } from 'apollo-angular';
import { Dashboard } from '@oort-front/shared';

// === GET DASHBOARD BY ID ===
/** Graphql query for getting a dashboard by its id */
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
      canSee
      canUpdate
      page {
        id
        application {
          id
        }
        canUpdate
      }
      step {
        id
        workflow {
          id
          page {
            id
            application {
              id
            }
          }
        }
        canUpdate
      }
    }
  }
`;

/** Model for GetDashboardByIdQueryResponse object */
export interface GetDashboardByIdQueryResponse {
  dashboard: Dashboard;
}
