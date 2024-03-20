import { gql } from 'apollo-angular';

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

/** Graphql request for deleting multiple users by their ids */
export const DELETE_USERS = gql`
  mutation deleteUsers($ids: [ID]!) {
    deleteUsers(ids: $ids)
  }
`;
