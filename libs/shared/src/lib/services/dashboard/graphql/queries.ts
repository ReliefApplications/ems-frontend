import { gql } from 'apollo-angular';

/** GraphQL mutation for creating a dashboard with context */
export const GET_DASHBOARD_WITH_CONTEXT = gql`
  query getDashboardWithContext($page: ID!, $element: JSON, $record: ID) {
    dashboardWithContext(page: $page, element: $element, record: $record) {
      dashboard {
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
      contextData
    }
  }
`;
