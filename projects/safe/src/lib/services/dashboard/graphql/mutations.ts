import { gql } from 'apollo-angular';
import { Dashboard } from '../../../models/dashboard.model';

// === EDIT DASHBOARD ===

/** Graphql request for editing a dashboard by its id */
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

/** Model for EditiDashboardMutationResponse object */
export interface EditDashboardMutationResponse {
  loading: boolean;
  editDashboard: Dashboard;
}
