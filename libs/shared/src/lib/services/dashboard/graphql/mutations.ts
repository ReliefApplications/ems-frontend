import { gql } from 'apollo-angular';

// === EDIT DASHBOARD ===

/** Graphql request for editing a dashboard by its id */
export const EDIT_DASHBOARD = gql`
  mutation editDashboard(
    $id: ID!
    $structure: JSON
    $name: String
    $buttons: [ButtonActionInputType]
    $gridOptions: JSON
  ) {
    editDashboard(
      id: $id
      structure: $structure
      name: $name
      buttons: $buttons
      gridOptions: $gridOptions
    ) {
      id
      name
      structure
      modifiedAt
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
      gridOptions
      canSee
      canUpdate
      page {
        id
        name
        application {
          id
        }
      }
    }
  }
`;

/** GraphQL mutation for updating the context of a Page */
export const UPDATE_PAGE_CONTEXT = gql`
  mutation editPageContext($id: ID!, $context: PageContextInputType!) {
    editPageContext(id: $id, context: $context) {
      id
      context
      contentWithContext
    }
  }
`;

/** GraphQL mutation for creating a dashboard with context */
export const CREATE_DASHBOARD_WITH_CONTEXT = gql`
  mutation createDashboardWithContext($page: ID!, $element: JSON, $record: ID) {
    addDashboardWithContext(page: $page, element: $element, record: $record) {
      id
      structure
      page {
        id
        context
      }
    }
  }
`;
