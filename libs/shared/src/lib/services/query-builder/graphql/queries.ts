import { gql } from 'apollo-angular';

/**
 * Get metadata of form / resource query definition.
 */
export const GET_QUERY_META_DATA = gql`
  query GetQueryMetaData($id: ID!) {
    form(id: $id) {
      id
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
    resource(id: $id) {
      id
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

/** Graphql request for getting query types */
export const GET_QUERY_TYPES = gql`
  query GetQueryTypes {
    types {
      availableQueries
      userFields
    }
  }
`;
