import { gql } from 'apollo-angular';
import { Resource } from '@safe/builder';

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetResourceById($id: ID!, $first: Int, $afterCursor: ID) {
    resource(id: $id) {
      id
      aggregations(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
            id
            name
            ${/** dataSource */ ''}
            sourceFields
            pipeline
            ${/** mapping */ ''}
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
  loading: boolean;
  resource: Resource;
}
