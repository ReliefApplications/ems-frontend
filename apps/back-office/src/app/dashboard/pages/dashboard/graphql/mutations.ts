import { gql } from 'apollo-angular';

// === EDIT DASHBOARD ===
/** Edit dashboard gql mutation definition */
export const EDIT_DASHBOARD = gql`
  mutation editDashboard(
    $id: ID!
    $structure: JSON
    $name: String
    $showFilter: Boolean
  ) {
    editDashboard(
      id: $id
      structure: $structure
      name: $name
      showFilter: $showFilter
    ) {
      id
      name
      structure
      modifiedAt
      showFilter
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
