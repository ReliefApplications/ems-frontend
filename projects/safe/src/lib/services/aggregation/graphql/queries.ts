import { gql } from 'apollo-angular';
import { Resource } from '../../../models/resource.model';

// === GET RELATED FORMS FROM RESOURCE ===
/** Graphql request to get resource aggregations */
export const GET_RESOURCE_AGGREGATIONS = gql`
  query GetGridResourceMeta($resource: ID!) {
    resource(id: $resource) {
      id
      name
      queryName
      aggregations {
        id
        name
        dataSource
        sourceFields
        pipeline
        mapping
        createdAt
      }
    }
  }
`;

// === GET RESOURCE BY ID ===
/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  loading: boolean;
  resource: Resource;
}
