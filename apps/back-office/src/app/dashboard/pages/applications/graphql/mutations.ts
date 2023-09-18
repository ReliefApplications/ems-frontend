import { gql } from 'apollo-angular';
import { Application } from '@oort-front/shared';

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

/** Edit application gql mutation response interface */
export interface EditApplicationMutationResponse {
  editApplication: Application;
}

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

/** Add application gql mutation response interface */
export interface AddApplicationMutationResponse {
  addApplication: Application;
}

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

/** Delete application gql mutation response interface */
export interface DeleteApplicationMutationResponse {
  deleteApplication: Application;
}
