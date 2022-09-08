import { gql } from 'apollo-angular';
import { Resource } from '../../../../../models/resource.model';
import { Record } from '../../../../../models/record.model';

/** Graphql request for getting resource meta date for a grid */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      forms {
        id
        name
      }
      layouts {
        id
        name
        query
        createdAt
        display
      }
      metadata
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  loading: boolean;
  resource: Resource;
}

// === GET RECORD BY ID ===
/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!, $display: Boolean) {
    record(id: $id) {
      id
      incrementalId
      createdAt
      modifiedAt
      createdBy {
        name
      }
      modifiedBy {
        name
      }
      data(display: $display)
      form {
        id
        name
        structure
      }
    }
  }
`;

/** Model for GetRecordByIdQueryResponse object */
export interface GetRecordByIdQueryResponse {
  loading: boolean;
  record: Record;
}

/** Graphql query for getting multiple resources with a cursor */
export const GET_RESOURCES = gql`
  query GetResources($first: Int, $afterCursor: ID, $sortField: String) {
    resources(first: $first, afterCursor: $afterCursor, sortField: $sortField) {
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
