import { gql } from 'apollo-angular';

// === EDIT DASHBOARD ===
/** Edit dashboard gql mutation definition */
export const EDIT_DASHBOARD = gql`
  mutation editDashboard(
    $id: ID!
    $structure: JSON
    $name: String
    $filter: DashboardFilterInputType
  ) {
    editDashboard(
      id: $id
      structure: $structure
      name: $name
      filter: $filter
    ) {
      id
      name
      structure
      filter
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
      canSee
      canUpdate
      page {
        id
        name
        application {
          shortcut
          id
        }
      }
    }
  }
`;

// === CREATE NEW DASHBOARD TEMPLATE ===
/** gql mutation to create a new dashboard template */
export const ADD_DASHBOARD_TEMPLATE = gql`
  mutation AddDashboardTemplate($id: ID!, $contextEl: JSON) {
    addDashboardTemplate(id: $id, contextEl: $contextEl) {
      id
      name
      createdAt
      contextData
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
      page {
        id
        icon
        visible
        application {
          shortcut
          id
        }
        canUpdate
        context
        content
        contentWithContext
      }
      step {
        id
        icon
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
// === DELETE DASHBOARD TEMPLATE ===
/** gql mutation to delete a dashboard template */
export const DELETE_DASHBOARD_TEMPLATES = gql`
  mutation DeleteDashboardTemplates($dashboardId: ID!, $templateIds: [ID!]) {
    deleteDashboardTemplates(
      dashboardId: $dashboardId
      templateIds: $templateIds
    )
  }
`;
