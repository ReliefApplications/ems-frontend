import { gql } from 'apollo-angular';

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
        showName
        application {
          shortcut
          id
        }
        canUpdate
      }
      step {
        id
        icon
        showName
        workflow {
          id
          page {
            id
            application {
              shortcut
              id
            }
          }
        }
        canUpdate
      }
      filter
      gridOptions
    }
  }
`;
