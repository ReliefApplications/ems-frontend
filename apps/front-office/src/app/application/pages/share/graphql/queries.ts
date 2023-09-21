import { gql } from 'apollo-angular';

// === GET URL NEEDED INFO FROM AN SPECIFIC DASHBOARD ID ===
/** Get dashbooard by id query */
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
