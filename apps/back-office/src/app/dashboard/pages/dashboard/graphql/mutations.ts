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
          id
        }
      }
    }
  }
`;
