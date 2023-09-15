import { gql } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';

// === GET RESOURCE BY ID ===

/** Graphql request for getting the name of a resource by its id */
export const GET_SHORT_RESOURCE_BY_ID = gql`
  query GetShortResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  resource: Resource;
}

// === GET RESOURCES ===

/** Graphql request for getting resources */
export const GET_RESOURCES = gql`
  query GetResources(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    resources(
      first: $first
      afterCursor: $afterCursor
      sortField: $sortField
      filter: $filter
    ) {
      edges {
        node {
          id
          name
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
