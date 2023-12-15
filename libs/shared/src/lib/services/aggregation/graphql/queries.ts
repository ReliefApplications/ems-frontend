import { gql } from 'apollo-angular';

/** Graphql request to get resource aggregations */
export const GET_RESOURCE_AGGREGATIONS = gql`
  query GetGridResourceMeta($resource: ID!, $ids: [ID], $first: Int) {
    resource(id: $resource) {
      id
      name
      queryName
      aggregations(ids: $ids, first: $first) {
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
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/** Graphql request to get reference data aggregations */
export const GET_REFERENCE_DATA_AGGREGATIONS = gql`
  query GetReferenceDataMeta($referenceData: ID!, $ids: [ID], $first: Int) {
    referenceData(id: $referenceData) {
      id
      name
      graphQLTypeName
      aggregations(ids: $ids, first: $first) {
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
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/** Query definition to get aggregation data */
export const GET_RESOURCE_AGGREGATION_DATA = gql`
  query GetResourceAggregationData(
    $resource: ID!
    $aggregation: ID!
    $mapping: JSON
    $first: Int
    $skip: Int
    $contextFilters: JSON
    $context: JSON
    $at: Date
    $sortOrder: String
    $sortField: String
  ) {
    recordsAggregation(
      resource: $resource
      aggregation: $aggregation
      mapping: $mapping
      first: $first
      skip: $skip
      contextFilters: $contextFilters
      context: $context
      at: $at
      sortOrder: $sortOrder
      sortField: $sortField
    )
  }
`;

/** Query definition to get aggregation data */
export const GET_REFERENCE_DATA_AGGREGATION_DATA = gql`
  query GetReferenceDataAggregationData(
    $referenceData: ID!
    $aggregation: ID!
    $mapping: JSON
    $first: Int
    $skip: Int
    $contextFilters: JSON
    $at: Date
    $sortOrder: String
    $sortField: String
  ) {
    referenceDataAggregation(
      referenceData: $referenceData
      aggregation: $aggregation
      mapping: $mapping
      first: $first
      skip: $skip
      contextFilters: $contextFilters
      at: $at
      sortOrder: $sortOrder
      sortField: $sortField
    )
  }
`;
