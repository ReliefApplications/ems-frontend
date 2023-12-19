import { gql } from 'apollo-angular';

/** Graphql request for listing resource's aggregations */
export const GET_RESOURCE_AGGREGATIONS = gql`
  query GetResourceAggregations($resource: ID!, $first: Int, $afterCursor: ID) {
    resource(id: $resource) {
      aggregations(first: $first, afterCursor: $afterCursor) {
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

/** Graphql request for listing reference data's aggregations */
export const GET_REFERENCE_DATA_AGGREGATIONS = gql`
  query GetReferenceDataAggregations(
    $referenceData: ID!
    $first: Int
    $afterCursor: ID
  ) {
    referenceData(id: $referenceData) {
      aggregations(first: $first, afterCursor: $afterCursor) {
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
