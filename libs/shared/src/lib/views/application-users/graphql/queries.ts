import { gql } from 'apollo-angular';

/** Application users query */
export const GET_APPLICATION_USERS = gql`
  query GetApplicationUsers(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $automated: Boolean
    $filter: JSON
  ) {
    application(id: $id) {
      users(
        afterCursor: $afterCursor
        first: $first
        automated: $automated
        filter: $filter
      ) {
        edges {
          node {
            id
            username
            name
            roles {
              id
              title
            }
            positionAttributes {
              value
            }
            oid
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
      }
    }
  }
`;
