import { gql } from 'apollo-angular';
import { User } from '@oort-front/safe';

// === GET ROLES ===
/** Graphql query for getting roles (of an application or all) */
export const GET_ROLES = gql`
  query GetRoles($all: Boolean, $application: ID) {
    roles(all: $all, application: $application) {
      id
      title
      permissions {
        id
        type
      }
      usersCount
      application {
        name
      }
    }
  }
`;

// === GET USERS ===
/** Graphql query for getting users */
export const GET_USERS = gql`
  query GetUsers($first: Int, $afterCursor: ID, $filter: JSON) {
    users(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
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
          oid
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
`;

/** Model for GetUsersQueryResponse object */
export interface GetUsersQueryResponse {
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
}
