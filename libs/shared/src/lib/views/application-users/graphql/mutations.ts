import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';

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
