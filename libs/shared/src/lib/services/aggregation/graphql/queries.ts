import { gql } from 'apollo-angular';

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

/** Query definition to get aggregation data */
export const GET_AGGREGATION_DATA = gql`
  query GetAggregationData(
    $resource: ID!
    $aggregation: ID!
    $mapping: JSON
    $first: Int
    $skip: Int
    $contextFilters: JSON
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
      sortOrder: $sortOrder
      sortField: $sortField
    )
  }
`;
