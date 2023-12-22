import { gql } from 'apollo-angular';

/** Graphql request to get resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!, $aggregationIds: [ID]) {
    resource(id: $id) {
      id
      name
      queryName
      forms {
        id
        name
      }
      aggregations(ids: $aggregationIds) {
        edges {
          node {
            id
            name
            sourceFields
            pipeline
            createdAt
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

/** Get reference data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!, $aggregationIds: [ID]) {
    referenceData(id: $id) {
      id
      name
      type
      fields
      valueField
      graphQLTypeName
      aggregations(ids: $aggregationIds) {
        edges {
          node {
            id
            name
            sourceFields
            pipeline
            createdAt
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

/** Graphql request to get reference data metadata */
export const GET_REFERENCE_DATA_METADATA = gql`
  query GetReferenceDataMetadata($id: ID!) {
    referenceData(id: $id) {
      id
      name
      fields
    }
  }
`;
