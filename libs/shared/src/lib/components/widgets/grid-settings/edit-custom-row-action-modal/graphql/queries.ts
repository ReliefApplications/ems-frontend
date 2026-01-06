import { gql } from 'apollo-angular';

/** Graphql request to get resource metadata */
export const GET_RESOURCE_METADATA = gql`
  query GetResourceMetadata($id: ID!) {
    resource(id: $id) {
      id
      name
      metadata {
        name
        automated
        type
        editor
        filter
        multiSelect
        filterable
        options
        fields {
          name
          automated
          type
          editor
          filter
          multiSelect
          filterable
          options
        }
      }
    }
  }
`;
