import { gql } from 'apollo-angular';

// === EDIT APPLICATION ===
/** Edit application gql mutation definition */
export const EDIT_APPLICATION = gql`
  mutation editApplication(
    $id: ID!
    $name: String
    $status: Status
    $pages: [ID]
    $permissions: JSON
    $description: String
  ) {
    editApplication(
      id: $id
      name: $name
      status: $status
      pages: $pages
      permissions: $permissions
      description: $description
    ) {
      id
      description
      name
      createdAt
      modifiedAt
      status
      locked
      lockedByUser
      pages {
        id
        icon
        name
        createdAt
        type
        content
      }
      settings
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
      canDelete
    }
  }
`;

// === ADD APPLICATION ===
/** Add application gql mutation definition */
export const ADD_APPLICATION = gql`
  mutation addApplication {
    addApplication {
      id
      name
      pages {
        id
        name
        createdAt
        type
        content
      }
      createdAt
    }
  }
`;

// === DELETE APPLICATION ===
/** Delete application gql mutation definition */
export const DELETE_APPLICATION = gql`
  mutation deleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;
