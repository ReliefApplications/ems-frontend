import { gql } from 'apollo-angular';

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
