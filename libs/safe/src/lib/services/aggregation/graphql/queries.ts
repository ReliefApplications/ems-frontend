import { gql } from 'apollo-angular';
import { Resource } from '../../../models/resource.model';
import { ReferenceData } from '../../../models/reference-data.model';

// === GET RELATED FORMS FROM RESOURCE ===
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

/** Interface for GET_RESOURCE_AGGREGATIONS query */
export interface GetResourceByIdQueryResponse {
  resource: Resource;
}

/** Graphql request to get resource aggregations */
export const GET_REFERENCE_DATA_AGGREGATIONS = gql`
  query GetGridReferenceDataMeta($referenceData: ID!, $ids: [ID], $first: Int) {
    referenceData(id: $referenceData) {
      id
      name
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

/** Interface for GET_REFERENCE_DATA_AGGREGATIONS query */
export interface GetReferenceDataByIdQueryResponse {
  referenceData: ReferenceData;
}

/** Query definition to get aggregation data */
export const GET_RESOURCE_AGGREGATION_DATA = gql`
  query GetAggregationData(
    $resource: ID!
    $aggregation: ID!
    $mapping: JSON
    $first: Int
    $skip: Int
    $contextFilters: JSON
  ) {
    recordsAggregation(
      resource: $resource
      aggregation: $aggregation
      mapping: $mapping
      first: $first
      skip: $skip
      contextFilters: $contextFilters
    )
  }
`;

/** Query definition to get aggregation data */
export const GET_REFERENCE_DATA_AGGREGATION_DATA = gql`
  query GetAggregationData(
    $referenceData: ID!
    $aggregation: ID!
    $mapping: JSON
    $first: Int
    $skip: Int
  ) {
    referenceDataAggregation(
      referenceData: $referenceData
      aggregation: $aggregation
      mapping: $mapping
      first: $first
      skip: $skip
    )
  }
`;

/** Interface for get aggregation data query */
export interface GetAggregationDataQueryResponse {
  recordsAggregation: any | { items: any[]; totalCount: number };
  referenceDataAggregation: any | { items: any[]; totalCount: number };
}
