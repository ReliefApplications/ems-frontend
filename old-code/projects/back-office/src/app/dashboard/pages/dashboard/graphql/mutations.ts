import { gql } from 'apollo-angular';
import { Step, Page, Dashboard } from '@safe/builder';

// === EDIT STEP ===
/** Edit step gql mutation definition */
export const EDIT_STEP = gql`
  mutation editStep(
    $id: ID!
    $name: String
    $type: String
    $content: ID
    $permissions: JSON
  ) {
    editStep(
      id: $id
      name: $name
      type: $type
      content: $content
      permissions: $permissions
    ) {
      id
      name
      type
      content
      createdAt
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
    }
  }
`;

/** Edit step gql mutation response interface */
export interface EditStepMutationResponse {
  editStep: Step;
}

// === EDIT PAGE ===
/** Edit page gql mutation definition */
export const EDIT_PAGE = gql`
  mutation editPage($id: ID!, $name: String, $permissions: JSON) {
    editPage(id: $id, name: $name, permissions: $permissions) {
      id
      name
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
    }
  }
`;

/** Edit page gql mutation response interface */
export interface EditPageMutationResponse {
  editPage: Page;
}

// === EDIT DASHBOARD ===
/** Edit dashboard gql mutation definition */
export const EDIT_DASHBOARD = gql`
  mutation editDashboard($id: ID!, $structure: JSON, $name: String) {
    editDashboard(id: $id, structure: $structure, name: $name) {
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

/** Edit dashboard gql mutation response interface */
export interface EditDashboardMutationResponse {
  editDashboard: Dashboard;
}
