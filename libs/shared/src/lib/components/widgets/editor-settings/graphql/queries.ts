import { gql } from 'apollo-angular';

/** Graphql request for getting resource  */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!, $layout: [ID]) {
    resource(id: $id) {
      id
      name
      queryName
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
      metadata {
        name
        type
      }
    }
  }
`;

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      incrementalId
      createdAt
      modifiedAt
      createdBy {
        name
      }
      modifiedBy {
        name
      }
      data
    }
  }
`;

/** Get reference data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
      type
      fields
      valueField
    }
  }
`;

/** Graphql request for getting resource layouts by its id */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetResource($resource: ID!) {
    resource(id: $resource) {
      layouts {
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
    }
  }
`;
