import { gql } from 'apollo-angular';

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
          aggregations {
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

/** Get ref data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!, $aggregation: [ID!]) {
    referenceData(id: $id) {
      id
      name
      type
      fields
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
