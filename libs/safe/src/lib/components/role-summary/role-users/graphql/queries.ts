import { gql } from 'apollo-angular';
import { User } from '../../../../models/user.model';

/** Get role users query definition */
export const GET_ROLE_USERS = gql`
  query GetRoleUsers(
    $id: ID!
    $first: Int
    $afterCursor: ID
    $automated: Boolean
  ) {
    role(id: $id) {
      users(first: $first, afterCursor: $afterCursor, automated: $automated) {
        edges {
          node {
            id
            name
            username
          }
          cursor
        }
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/** Get role query response interface */
export interface GetRoleQueryResponse {
  role: {
    users: {
      edges: {
        node: User;
        cursor: string;
      }[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      totalCount: number;
    };
  };
}
