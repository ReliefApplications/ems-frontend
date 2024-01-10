import { gql } from '@apollo/client';

/** Graphql request for getting users (optionally by a list of application ids) */
export const GET_USERS = gql`
  query GetUsers(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $applications: [ID]
    $skip: Int
  ) {
    users(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      applications: $applications
      skip: $skip
    ) {
      edges {
        node {
          id
          username
          name
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
