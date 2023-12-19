import { gql } from '@apollo/client';

/** Graphql query for getting records of a resource */
export const GET_RESOURCE_RECORDS = gql`
  query GetResourceRecords(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $filter: JSON
  ) {
    resource(id: $id) {
      records(first: $first, afterCursor: $afterCursor, filter: $filter) {
        edges {
          node {
            id
            incrementalId
            data
            form {
              id
            }
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
