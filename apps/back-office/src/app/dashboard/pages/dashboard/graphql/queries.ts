import { gql } from 'apollo-angular';

// === GET DASHBOARD BY ID ===
/** Graphql query for getting a dashboard by its id */
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!, $contextEl: JSON) {
    dashboard(id: $id, contextEl: $contextEl) {
      id
      name
      createdAt
      contextData
      structure
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
      buttons
      canSee
      canUpdate
      page {
        id
        icon
        showName
        visible
        application {
          id
          shortcut
        }
        canUpdate
        context
        content
        contentWithContext
      }
      step {
        id
        icon
        showName
        workflow {
          id
          name
          page {
            id
            application {
              id
              shortcut
            }
          }
        }
        canUpdate
      }
      filter
      gridOptions
      defaultTemplate
    }
  }
`;

// === GET DASHBOARD BY ID ===
/** Graphql query for getting a dashboard by its id */
export const GET_DASHBOARDS_NAMES = gql`
  query GetDashboardsById($ids: [ID]!) {
    dashboards(ids: $ids) {
      id
      name
    }
  }
`;

/** Graphql query for getting records of a resource */
export const GET_RESOURCE_RECORDS = gql`
  query GetResourceRecords(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $filter: JSON
  ) {
    resource(id: $id) {
      records(first: $first, afterCursor: $afterCursor, filter: $filter) {
        edges {
          node {
            id
            incrementalId
            data
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
  }
`;

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      data
    }
  }
`;
