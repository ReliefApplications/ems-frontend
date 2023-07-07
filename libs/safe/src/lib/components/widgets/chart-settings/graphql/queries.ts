import { gql } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';
import { ReferenceData } from '../../../../models/reference-data.model';
import { Connection } from '../../../../utils/graphql/connection.type';

// === GET RESOURCES ===
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

/** Graphql request to get resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!, $aggregationIds: [ID]) {
    resource(id: $id) {
      id
      name
      queryName
      forms {
        id
        name
      }
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
          fields
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
