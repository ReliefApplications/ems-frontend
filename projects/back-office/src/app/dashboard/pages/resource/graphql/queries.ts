import { gql } from 'apollo-angular';
import { Resource } from '@safe/builder';

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      createdAt
      fields
      metadata
      layouts {
        id
        name
        createdAt
        query
        display
      }
      forms {
        id
        name
        status
        createdAt
        recordsCount
        core
        canUpdate
        canDelete
        canCreateRecords
      }
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
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
