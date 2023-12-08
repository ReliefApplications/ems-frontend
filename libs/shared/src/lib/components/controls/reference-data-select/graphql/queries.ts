import { gql } from 'apollo-angular';

/** Graphql query for getting multiple resources with a cursor */
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    referenceDatas(
      first: $first
      afterCursor: $afterCursor
      sortField: $sortField
      filter: $filter
    ) {
      edges {
        node {
          id
          name
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
