import { gql } from 'apollo-angular';

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

// === DELETE USER ===

/** Graphql request for deleting multiple users by their ids */
export const DELETE_USERS = gql`
  mutation deleteUsers($ids: [ID]!) {
    deleteUsers(ids: $ids)
  }
`;

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
