import { gql } from 'apollo-angular';

// === GET PULL JOBS ===

/** Graphql queryfor getting multiple pull job objects with a cursor */
export const GET_PULL_JOBS = gql`
  query GetPullJobs($first: Int, $afterCursor: ID) {
    pullJobs(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          status
          apiConfiguration {
            id
            name
            authType
          }
          url
          path
          schedule
          convertTo {
            id
            name
          }
          mapping
          uniqueIdentifiers
          channel {
            id
            title
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

// === GET ROUTING KEYS ===

/** Graphql query for getting routing keys with a cursor */
export const GET_ROUTING_KEYS = gql`
  query GetRoutingKeys($first: Int, $afterCursor: ID) {
    applications(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          channels {
            id
            title
            routingKey
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

// === GET FORMS ===
/** Graphql query for getting form names */
export const GET_FORM_NAMES = gql`
  query GetFormNames(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    forms(
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

// === GET FORM BY ID ===
/** Graphql query for getting a form with minimum details by id */
export const GET_SHORT_FORM_BY_ID = gql`
  query GetShortFormById($id: ID!) {
    form(id: $id) {
      id
      name
      core
      structure
      fields
      status
      canCreateRecords
      uniqueRecord {
        id
        modifiedAt
        data
      }
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
      canUpdate
    }
  }
`;

// === GET API CONFIGURATIONS ===

/** Graphql query for getting multiple api configurations object with a cursor */
export const GET_API_CONFIGURATIONS = gql`
  query GetApiConfigurations($first: Int, $afterCursor: ID) {
    apiConfigurations(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          name
          status
          authType
          endpoint
          pingUrl
          settings
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
          canSee
          canUpdate
          canDelete
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
