import { gql } from 'apollo-angular';
import { Resource, ReferenceData, Connection } from '@oort-front/safe';

/** GraphQL query definition to get single resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      fields
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

/** Model for GetResourcesQueryResponse object */
export interface GetResourcesQueryResponse {
  resources: Connection<Resource>;
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
