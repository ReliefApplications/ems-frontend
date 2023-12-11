import { gql } from 'apollo-angular';

/** Graphql query for getting records of a resource */
export const GET_RESOURCE_RECORDS = gql`
  query GetResourceRecords(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $filter: JSON
    $display: Boolean
    $showDeletedRecords: Boolean
  ) {
    resource(id: $id) {
      records(
        first: $first
        afterCursor: $afterCursor
        filter: $filter
        archived: $showDeletedRecords
      ) {
        edges {
          node {
            id
            incrementalId
            data(display: $display)
            form {
              id
              name
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
