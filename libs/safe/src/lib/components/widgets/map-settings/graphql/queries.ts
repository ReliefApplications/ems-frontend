import { gql } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';
import { ReferenceData } from '../../../../models/reference-data.model';
import { Connection } from '../../../../utils/graphql/connection.type';

// === GET RESOURCE ===
// todo: use @include decorators to avoid query of layouts / aggregations in the future
/** GraphQL query definition to get single resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!, $layout: [ID!], $aggregation: [ID!]) {
    resource(id: $id) {
      id
      name
      queryName
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
    }
  }
`;

/** Response interface of get single resource query */
export interface GetResourceQueryResponse {
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
    $layout: [ID!]
    $aggregation: [ID!]
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

/** Get list of ref data gql query definition */
export const GET_REFERENCE_DATAS = gql`
  query GetReferenceDatas($first: Int, $afterCursor: ID) {
    referenceDatas(
      first: $first
      afterCursor: $afterCursor
      sortField: "name"
      sortOrder: "asc"
    ) {
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
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
      type
      fields
    }
  }
`;

/** Get ref data gql query response interface */
export interface GetReferenceDataQueryResponse {
  referenceData: ReferenceData;
}
