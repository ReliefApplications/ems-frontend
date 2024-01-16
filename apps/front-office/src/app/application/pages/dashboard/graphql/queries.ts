import { gql } from 'apollo-angular';

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
