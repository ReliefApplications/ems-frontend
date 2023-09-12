import { gql } from 'apollo-angular';

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetResourceById($id: ID!, $first: Int, $afterCursor: ID) {
    resource(id: $id) {
      id
      layouts(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
      canUpdate
    }
  }
`;
