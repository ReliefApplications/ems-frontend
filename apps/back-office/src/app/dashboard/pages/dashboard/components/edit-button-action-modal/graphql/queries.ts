import { gql } from 'apollo-angular';

/** Graphql request for getting resource meta date for a grid */
export const GET_RESOURCE_TEMPLATES = gql`
  query GetGridResourceMeta($resource: ID!) {
    resource(id: $resource) {
      id
      name
      queryName
      forms {
        id
        name
      }
      relatedForms {
        id
        name
        fields
        resource {
          id
          queryName
          name
          fields
        }
      }
    }
  }
`;
