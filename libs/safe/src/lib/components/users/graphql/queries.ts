import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';

// === GET USERS ===

/** Model for GetUsersQueryResponse object */
export interface GetUsersQueryResponse {
  users: User[];
}

/** Graphql request for getting users (optionnally by a list of application ids) */
export const GET_USERS = gql`
  query GetUsers($applications: [ID]) {
    users(applications: $applications) {
      id
      username
      name
      oid
    }
  }
`;
