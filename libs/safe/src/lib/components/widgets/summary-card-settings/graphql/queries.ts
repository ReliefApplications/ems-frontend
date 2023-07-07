import { gql } from 'apollo-angular';
import { Record } from '../../../../models/record.model';
import { Resource } from '../../../../models/resource.model';
import { Layout } from '../../../../models/layout.model';
import { ReferenceData } from '../../../../models/reference-data.model';
import { Connection } from '../../../../utils/public-api';

// === GET RECORD BY ID ===
/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
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
      data
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

/** Graphql request for getting resource meta date for a grid */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      layouts {
        id
        query
      }
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceLayoutsByIdQueryResponse {
  resource: {
    layouts: {
      id: Layout['id'];
      query: Layout['query'];
    }[];
  };
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
          queryName
          forms {
            id
            name
          }
          layouts {
            totalCount
          }
          aggregations {
            totalCount
          }
          metadata {
            name
            type
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

/** Graphql request for getting resource by id */
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

/** Get list of ref data gql query definition */
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas($first: Int, $afterCursor: ID) {
    referenceDatas(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          type
          aggregations {
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

/** Get list of ref data gql query response interface */
export interface GetReferenceDatasQueryResponse {
  referenceDatas: Connection<ReferenceData>;
}

/** Get ref data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!, $aggregationIds: [ID]) {
    referenceData(id: $id) {
      id
      name
      type
      fields
      aggregations(ids: $aggregationIds) {
        edges {
          node {
            id
            name
            sourceFields
            pipeline
            createdAt
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

/** Get ref data gql query response interface */
export interface GetReferenceDataByIdQueryResponse {
  referenceData: ReferenceData;
}
