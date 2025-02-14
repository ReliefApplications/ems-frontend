import { gql } from 'apollo-angular';

/**
 * Dashboard query.
 */
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!, $contextEl: JSON) {
    dashboard(id: $id, contextEl: $contextEl) {
      id
      name
      createdAt
      structure
      contextData
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
      filter
      gridOptions
      page {
        id
        showName
        visible
        application {
          id
          shortcut
        }
        canUpdate
        context
        content
        contentWithContext
      }
      step {
        showName
        workflow {
          name
        }
      }
    }
  }
`;
