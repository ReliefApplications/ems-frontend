import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';

/** Graphql request for removing multiple users from an application  */
export const DELETE_USERS_FROM_APPLICATION = gql`
  mutation deleteUsersFromApplication($ids: [ID]!, $application: ID!) {
    deleteUsersFromApplication(ids: $ids, application: $application) {
      id
      username
      name
      roles {
        id
        title
      }
      oid
    }
  }
`;

/** Model for DeleteUsersFromApplicationMutationResponse object */
export interface DeleteUsersFromApplicationMutationResponse {
  loading: boolean;
  deleteUsersFromApplication: User[];
}

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
  loading: boolean;
  addUsers: User[];
}
