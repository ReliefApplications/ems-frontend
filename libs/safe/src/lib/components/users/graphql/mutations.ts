import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';

// === ADD USER ===

/** Graphql request for adding users to an application */
export const ADD_USERS = gql`
  mutation addUsers($users: [UserInputType]!, $application: ID) {
    addUsers(users: $users, application: $application) {
      id
      username
      name
      roles {
        id
        title
      }
      positionAttributes {
        value
        category {
          id
          title
        }
      }
      oid
    }
  }
`;

/** Model for AddUsersMutationResponse object */
export interface AddUsersMutationResponse {
  addUsers: User[];
}

// === DELETE USER ===

/** Graphql request for deleting multiple users by their ids */
export const DELETE_USERS = gql`
  mutation deleteUsers($ids: [ID]!) {
    deleteUsers(ids: $ids)
  }
`;

/** Model for DeleteUsersMutationResponse object */
export interface DeleteUsersMutationResponse {
  deleteUsers: number;
}

// === EDIT USER ===

/** Graphql request for editing roles of a user by its id */
export const EDIT_USER = gql`
  mutation editUser(
    $id: ID!
    $roles: [ID]!
    $application: ID
    $positionAttributes: [PositionAttributeInputType]
  ) {
    editUser(
      id: $id
      roles: $roles
      application: $application
      positionAttributes: $positionAttributes
    ) {
      id
      username
      name
      roles {
        id
        title
        application {
          id
        }
      }
      positionAttributes {
        value
        category {
          id
          title
        }
      }
      oid
    }
  }
`;

/** Model for EditUserMutationResponse object */
export interface EditUserMutationResponse {
  editUser: User;
}
