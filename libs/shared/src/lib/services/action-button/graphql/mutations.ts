import { gql } from 'apollo-angular';

// === EDIT DASHBOARD ===

/** Graphql request for editing a dashboard action button by its id */
export const EDIT_DASHBOARD_ACTIONS = gql`
  mutation editDashboard($id: ID!, $buttons: [ActionButtonInputType]) {
    editDashboard(id: $id, buttons: $buttons) {
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
          shortcut
        }
      }
    }
  }
`;

/** Graphql request for editing a page form action button by its id */
export const EDIT_PAGE_ACTIONS = gql`
  mutation editPage($id: ID!, $buttons: [ActionButtonInputType]) {
    editPage(id: $id, buttons: $buttons) {
      id
      name
      buttons
    }
  }
`;
/** Graphql request for editing a step form action button by its id */
export const EDIT_STEP_ACTIONS = gql`
  mutation editStep($id: ID!, $buttons: [ActionButtonInputType]) {
    editStep(id: $id, buttons: $buttons) {
      id
      name
      buttons
    }
  }
`;
