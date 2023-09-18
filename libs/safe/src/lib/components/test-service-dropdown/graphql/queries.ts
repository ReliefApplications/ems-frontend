import { gql } from 'apollo-angular';
import { Resource } from '../../../models/resource.model';
import { Record } from '../../../models/record.model';

// === GET RECORDS FROM RESOURCE ===

/** graphql request for getting records of a resource by its id */
export const GET_RESOURCE_RECORDS = gql`
  query GetResourceRecords(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $filter: JSON
    $display: Boolean
  ) {
    resource(id: $id) {
      name
      records(first: $first, afterCursor: $afterCursor, filter: $filter) {
        edges {
          node {
            id
            data(display: $display)
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
/** Modelf for GetResouceRecordsQueryResponse object */
export interface GetResourceRecordsQueryResponse {
  resource: Resource;
}

// === GET RECORD BY ID ===

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
  record: Record;
}
