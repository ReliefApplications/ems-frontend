import { gql } from 'apollo-angular';

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

// === GET RESOURCES ===
/** Graphql request for getting resources */
export const GET_RESOURCES = gql`
  query GetResources($first: Int, $afterCursor: ID, $sortField: String) {
    resources(first: $first, afterCursor: $afterCursor, sortField: $sortField) {
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
