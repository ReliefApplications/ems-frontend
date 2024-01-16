import { gql } from 'apollo-angular';

// === GET RELATED FORMS FROM RESOURCE ===
/** Graphql request for getting resource meta date for a grid */
export const GET_GRID_RESOURCE_META = gql`
  query GetGridResourceMeta(
    $resource: ID!
    $first: Int
    $afterCursor: ID
    $ids: [ID]
  ) {
    resource(id: $resource) {
      id
      name
      queryName
      forms {
        id
        name
      }
      layouts(first: $first, afterCursor: $afterCursor, ids: $ids) {
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
    }
  }
`;

// === GET FORM BY ID ===
/** Graphql request for getting the meta fields of a grid by form id */
export const GET_GRID_FORM_META = gql`
  query GetFormAsTemplate($id: ID!, $first: Int, $afterCursor: ID) {
    form(id: $id) {
      id
      name
      queryName
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
    }
  }
`;
