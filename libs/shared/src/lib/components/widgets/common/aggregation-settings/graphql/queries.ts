import { gql } from 'apollo-angular';

/** Graphql query for getting multiple resources with a cursor */
export const GET_RESOURCES = gql`
  query GetResources(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    resources(
      first: $first
      afterCursor: $afterCursor
      sortField: $sortField
      filter: $filter
    ) {
      edges {
        node {
          id
          name
          queryName
          forms {
            id
            name
          }
          layouts {
            totalCount
          }
          aggregations {
            totalCount
          }
          metadata {
            name
            type
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
`;

/** Graphql request for getting resource by id */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!, $layout: [ID], $aggregation: [ID]) {
    resource(id: $id) {
      id
      name
      queryName
      forms {
        id
        name
      }
      layouts(ids: $layout) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
        totalCount
      }
      aggregations(ids: $aggregation) {
        edges {
          node {
            id
            name
            sourceFields
            pipeline
            createdAt
          }
        }
        totalCount
      }
      metadata {
        name
        type
      }
    }
  }
`;
