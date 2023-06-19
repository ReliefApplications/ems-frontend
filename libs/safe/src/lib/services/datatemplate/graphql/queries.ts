import { gql } from 'apollo-angular';
import { Resource } from '../../../models/resource.model';

/** Graphql request for getting resource layout */
export const GET_LAYOUT = gql`
  query GetLayout($resource: ID!, $id: ID) {
    resource(id: $resource) {
      layouts(ids: [$id]) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
      }
      metadata {
        name
        type
      }
    }
  }
`;

/** Model for GetLayoutQueryResponse object */
export interface GetLayoutQueryResponse {
  resource: Resource;
}
