import { gql } from 'apollo-angular';

/**
 * Dashboard query.
 */
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!, $contextEl: JSON) {
    dashboard(id: $id, contextEl: $contextEl) {
      id
      name
      nameTranslations
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
        navBar {
          showName
          showIcon
        }
        visible
        icon
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
        icon
        showName
        navBar {
          showName
          showIcon
        }
        workflow {
          name
        }
      }
    }
  }
`;
