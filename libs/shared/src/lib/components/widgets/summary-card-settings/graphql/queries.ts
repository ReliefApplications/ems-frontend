import { gql } from 'apollo-angular';

/** Graphql request for getting resource meta date for a grid */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      layouts {
        id
        query
      }
    }
  }
`;

// === GET RECORD BY ID ===
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
      form {
        id
        name
        structure
      }
    }
  }
`;

/** Graphql query for getting multiple resources with a cursor */
export const GET_RESOURCES = gql`
  query GetResources(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    resources(
      first: $first
      afterCursor: $afterCursor
      sortField: $sortField
      filter: $filter
    ) {
      edges {
        node {
          id
          name
          queryName
          forms {
            id
            name
          }
          layouts {
            totalCount
          }
          aggregations {
            totalCount
          }
          metadata {
            name
            type
          }
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

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

// === GET RELATED FORMS FROM RESOURCE ===

/** Graphql request for getting resource meta date for a grid */
export const GET_GRID_RESOURCE_META = gql`
  query GetGridResourceMeta(
    $resource: ID!
    $layoutIds: [ID]
    $firstLayouts: Int
    $aggregationIds: [ID]
    $firstAggregations: Int
  ) {
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
      layouts(ids: $layoutIds, first: $firstLayouts) {
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
      aggregations(ids: $aggregationIds, first: $firstAggregations) {
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
