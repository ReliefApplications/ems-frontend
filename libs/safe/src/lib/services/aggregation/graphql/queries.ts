import { gql } from 'apollo-angular';
import { Resource } from '../../../models/resource.model';

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

/** Query definition to get aggregation data */
export const GET_AGGREGATION_DATA = gql`
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

/** Interface for get aggregation data query */
export interface GetAggregationDataQueryResponse {
  recordsAggregation: any | { items: any[]; totalCount: number };
}
