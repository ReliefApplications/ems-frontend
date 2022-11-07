import { gql } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';

/** Get resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      metadata
    }
  }
`;

/** Interface of get resource query */
export interface GetResourceByIdQueryResponse {
  resource: Resource;
}
