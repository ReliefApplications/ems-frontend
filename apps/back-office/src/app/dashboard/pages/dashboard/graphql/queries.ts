import { gql } from 'apollo-angular';
import { Connection, Dashboard, Record } from '@oort-front/safe';

// === GET DASHBOARD BY ID ===
/** Graphql query for getting a dashboard by its id */
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!) {
    dashboard(id: $id) {
      id
      name
      createdAt
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
        visible
        application {
          id
        }
        canUpdate
        context
        content
        contentWithContext
      }
      step {
        id
        workflow {
          id
          page {
            id
            application {
              id
            }
          }
        }
        canUpdate
      }
      showFilter
    }
  }
`;

/** Model for GetDashboardByIdQueryResponse object */
export interface GetDashboardByIdQueryResponse {
  dashboard: Dashboard;
}

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

/** Model for GetResourceRecordsQueryResponse object */
export interface GetResourceRecordsQueryResponse {
  resource: {
    records: Connection<Record>;
  };
}

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      data
    }
  }
`;

/** Model for GetRecordByIdQueryResponse object */
export interface GetRecordByIdQueryResponse {
  record: Pick<Record, 'id' | 'data'>;
}
