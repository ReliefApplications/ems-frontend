import { gql } from 'apollo-angular';

// === EDIT DASHBOARD ===

/** Graphql request for editing a dashboard quick action buttons by its id */
export const EDIT_DASHBOARD_ACTIONS = gql`
  mutation editDashboard($id: ID!, $buttons: [ButtonActionInputType]) {
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

/** Graphql request for editing a form quick action buttons by its id */
export const EDIT_FORM_ACTIONS = gql`
  mutation editForm($id: ID!, $buttons: [ButtonActionInputType]) {
    editForm(id: $id, buttons: $buttons) {
      id
      name
      buttons
    }
  }
`;
