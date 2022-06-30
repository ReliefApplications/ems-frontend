import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';

/** Graphql query to get user by id */
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      firstName
      lastName
      username
    }
  }
`;

/** GraphQL interface of get user by id query */
export interface GetUserQueryResponse {
  loading: boolean;
  user: User;
}
