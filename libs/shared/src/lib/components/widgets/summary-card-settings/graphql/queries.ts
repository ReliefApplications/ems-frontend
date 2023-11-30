import { gql } from 'apollo-angular';

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
