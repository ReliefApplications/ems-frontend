import { gql } from 'apollo-angular';
import { Resource } from '@safe/builder';

// === GET RESOURCE BY ID ===

/** Graphq query for getting a resource by its id */
export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      createdAt
      fields
      forms {
        id
        name
        core
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

// === GET RESOURCES ===
/** Graphql query for getting multiple resources with a cursor */
export const GET_RESOURCES = gql`
  query GetResources($first: Int, $afterCursor: ID) {
    resources(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          forms {
            id
            name
          }
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Model for GetResourcesQueryResponse object */
export interface GetResourcesQueryResponse {
  loading: boolean;
  resources: {
    edges: {
      node: Resource;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}
