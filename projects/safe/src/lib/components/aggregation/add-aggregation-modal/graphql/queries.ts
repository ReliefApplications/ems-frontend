import { gql } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';
import { Form } from '../../../../models/form.model';

// === FETCH AGGREGATIONS ===

/** Graphql request for getting resource aggregations by its id */
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

/** Model for GetResourceAggregationsResponse object */
export interface GetResourceAggregationsResponse {
  loading: boolean;
  resource: Resource;
}
