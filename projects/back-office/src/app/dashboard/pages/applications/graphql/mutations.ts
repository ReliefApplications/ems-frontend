import { gql } from 'apollo-angular';
import { Application } from '@safe/builder';

// === EDIT APPLICATION ===
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

export interface EditApplicationMutationResponse {
  loading: boolean;
  editApplication: Application;
}

// === ADD APPLICATION ===
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

export interface AddApplicationMutationResponse {
  loading: boolean;
  addApplication: Application;
}

// === DELETE APPLICATION ===
export const DELETE_APPLICATION = gql`
  mutation deleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;

export interface DeleteApplicationMutationResponse {
  loading: boolean;
  deleteApplication: Application;
}
