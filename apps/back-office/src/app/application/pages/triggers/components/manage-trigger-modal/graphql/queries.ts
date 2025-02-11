import { gql } from 'apollo-angular';

/** Graphql request for getting channels */
export const GET_CHANNELS = gql`
  query getChannels($application: ID) {
    channels(application: $application) {
      id
      title
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
