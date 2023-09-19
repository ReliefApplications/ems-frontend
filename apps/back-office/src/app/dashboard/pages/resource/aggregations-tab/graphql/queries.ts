import { gql } from 'apollo-angular';
import { Resource } from '@oort-front/shared';

/** Graphql query for getting resource aggregations */
export const GET_RESOURCE_AGGREGATIONS = gql`
  query GetResourceById($id: ID!, $first: Int, $afterCursor: ID) {
    resource(id: $id) {
      id
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
      canUpdate
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  resource: Resource;
}
