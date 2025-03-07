import { gql } from 'apollo-angular';

// === GET REFERENCE DATA ===
/** Get ref data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
      apiConfiguration {
        id
        name
      }
      type
      query
      fields
      valueField
      path
      data
      graphQLFilter
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      pageInfo {
        strategy
        cursorField
        cursorVar
        offsetVar
        pageVar
        pageSizeVar
        totalCountField
      }
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Get API configuration gl query */
export const GET_API_CONFIGURATION = gql`
  query GetApiConfiguration($id: ID!) {
    apiConfiguration(id: $id) {
      id
      name
      authType
      endpoint
      graphQLEndpoint
    }
  }
`;

// === GET API CONFIGURATIONS NAME ===
/** API configuration names query */
export const GET_API_CONFIGURATIONS_NAMES = gql`
  query GetApiConfigurationsName($first: Int, $afterCursor: ID, $filter: JSON) {
    apiConfigurations(
      first: $first
      afterCursor: $afterCursor
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
