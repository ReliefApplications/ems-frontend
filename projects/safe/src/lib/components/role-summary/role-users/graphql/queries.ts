import { gql } from 'apollo-angular';
import { User } from '../../../../models/user.model';

/** Get role users query definition */
export const GET_ROLE_USERS = gql`
  query GetRoleUsers($id: ID!, $first: Int, $afterCursor: ID) {
    role(id: $id) {
      users(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
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

/** Get role auto assigned users query definition */
export const GET_ROLE_AUTO_ASSIGNED_USERS = gql`
  query GetRoleUsers($id: ID!, $first: Int, $afterCursor: ID) {
    role(id: $id) {
      autoAssignedUsers(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
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
export interface GetRoleAutoAssignedUsersQueryResponse {
  role: {
    autoAssignedUsers: {
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
