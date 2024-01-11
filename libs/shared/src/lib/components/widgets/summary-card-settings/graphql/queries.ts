import { gql } from 'apollo-angular';

/** Graphql request for getting resource by id */
export const GET_RESOURCE = gql`
  query GetResource(
    $id: ID!
    $layout: [ID]
    $ignoreLayouts: Boolean
    $aggregation: [ID]
    $ignoreAggregations: Boolean
    $formId: ID
    $ignoreForms: Boolean
    $ignoreMetadata: Boolean
  ) {
    resource(id: $id) {
      id
      name
      queryName
      forms(id: $formId, ignore: $ignoreForms) {
        id
        name
      }
      layouts(ids: $layout, ignore: $ignoreLayouts) {
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
      aggregations(ids: $aggregation, ignore: $ignoreAggregations) {
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
      metadata(ignore: $ignoreMetadata) {
        name
        type
      }
    }
  }
`;

/** Get reference data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
      fields
    }
  }
`;

/** Graphql request for getting the related templates of a resource */
export const GET_RESOURCE_TEMPLATES = gql`
  query GetResource($resource: ID!) {
    resource(id: $resource) {
      forms {
        id
        name
      }
    }
  }
`;

/** Graphql request for getting resource layouts by its id */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetGridResourceMeta($resource: ID!) {
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
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

/** Graphql request for getting resource aggregations by its id */
export const GET_RESOURCE_AGGREGATIONS = gql`
  query GetResource($resource: ID!) {
    resource(id: $resource) {
      aggregations {
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
    }
  }
`;
