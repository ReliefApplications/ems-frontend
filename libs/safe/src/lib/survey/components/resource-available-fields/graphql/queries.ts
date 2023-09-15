import { gql } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';

/** Get short resource graphql query definition */
export const GET_SHORT_RESOURCE_BY_ID = gql`
  query GetShortResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      createdAt
      fields
      forms {
        id
        name
        status
        createdAt
        recordsCount
        core
        canUpdate
        canDelete
      }
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  resource: Resource;
}
