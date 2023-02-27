import { gql } from 'apollo-angular';
import { Resource } from '../../../../../models/resource.model';
import { Record } from '../../../../../models/record.model';

/** Graphql request for getting resource meta date for a grid */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!, $layout: [ID], $aggregation: [ID]) {
    resource(id: $id) {
      id
      name
      queryName
      forms {
        id
        name
      }
      layouts(ids: $layout) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
        totalCount
      }
      aggregations(ids: $aggregation) {
        edges {
          node {
            id
            name
            sourceFields
            pipeline
            createdAt
          }
        }
        totalCount
      }
      metadata {
        name
        type
      }
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
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
  record: Record;
}

/** Graphql query for getting multiple resources with a cursor */
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
          forms {
            id
            name
          }
          layouts {
            totalCount
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

/** Graphql request for getting resource aggregation */
export const GET_AGGREGATION = gql`
  query GetAggregation($resource: ID!, $id: ID) {
    resource(id: $resource) {
      aggregations(ids: [$id]) {
        edges {
          node {
            id
            name
            sourceFields
            pipeline
            createdAt
          }
        }
      }
    }
  }
`;

/** Model for GetAggregationQueryResponse object */
export interface GetAggregationQueryResponse {
  resource: Resource;
}
