import { gql } from 'apollo-angular';

/** Graphql request for getting resource metadata */
export const GET_RESOURCE_METADATA = gql`
  query GetResourceMeta($id: ID!) {
    resource(id: $id) {
      queryName
      metadata {
        name
        type
      }
    }
  }
`;

/** Graphql request for getting resource layout */
export const GET_LAYOUT = gql`
  query GetLayout($resource: ID!, $id: ID) {
    resource(id: $resource) {
      layouts(ids: [$id]) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
      }
      metadata {
        name
        type
      }
    }
  }
`;
