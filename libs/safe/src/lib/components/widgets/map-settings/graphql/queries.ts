import { gql } from 'apollo-angular';

// === GET RESOURCE ===
/** GraphQL query definition to get single resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
    }
  }
`;

// === GET RESOURCES ===
/** Graphql request for getting resources */
export const GET_RESOURCES = gql`
  query GetResources($first: Int, $afterCursor: ID, $sortField: String) {
    resources(first: $first, afterCursor: $afterCursor, sortField: $sortField) {
      edges {
        node {
          id
          name
          queryName
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
