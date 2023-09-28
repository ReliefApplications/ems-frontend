import { gql } from 'apollo-angular';

// === EDIT PAGE ===
/** Edit page gql mutation definition */
export const EDIT_PAGE = gql`
  mutation editPage(
    $id: ID!
    $name: String
    $permissions: JSON
    $visible: Boolean
  ) {
    editPage(
      id: $id
      name: $name
      permissions: $permissions
      visible: $visible
    ) {
      id
      name
      visible
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
