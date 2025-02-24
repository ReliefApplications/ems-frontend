import { gql } from 'apollo-angular';

// === GET URL NEEDED INFO FROM AN SPECIFIC DASHBOARD ID ===
/** Get dashboard by id query */
export const GET_SHARE_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    dashboard(id: $id) {
      id
      page {
        application {
          shortcut
          id
        }
      }
      step {
        workflow {
          id
          page {
            application {
              shortcut
              id
            }
          }
        }
      }
    }
  }
`;
