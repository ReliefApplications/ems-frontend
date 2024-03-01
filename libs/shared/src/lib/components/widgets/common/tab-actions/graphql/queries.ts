import { gql } from 'apollo-angular';

/** Graphql request for getting resource layout */
export const GET_LAYOUTS = gql`
  query GetLayout($resource: ID!, $id: [ID]) {
    resource(id: $resource) {
      layouts(ids: $id) {
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
