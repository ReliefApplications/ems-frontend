import { gql } from 'apollo-angular';
import { Resource } from '@safe/builder';

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      id
      layouts {
        id
        name
        createdAt
        query
        display
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
