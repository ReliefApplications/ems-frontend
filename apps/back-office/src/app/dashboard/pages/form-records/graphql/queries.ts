import { gql } from 'apollo-angular';
import { Record, Form } from '@oort-front/shared';

// === GET RECORD DETAILS ===

/** Graphql query for getting all details of a record by its id */
export const GET_RECORD_DETAILS = gql`
  query GetRecordDetails($id: ID!) {
    record(id: $id) {
      id
      incrementalId
      data
      createdAt
      modifiedAt
      form {
        id
        name
        createdAt
        structure
        fields
        core
      }
      versions {
        id
        createdAt
        data
        createdBy {
          name
        }
      }
    }
  }
`;

/** Model for GetRecordDetailsQueryResponse object */
export interface GetRecordDetailsQueryResponse {
  record: Record;
}

/** Graphql query for getting the records of a form */
export const GET_FORM_RECORDS = gql`
  query GetFormRecords(
    $id: ID!
    $afterCursor: ID
    $first: Int
    $filter: JSON
    $display: Boolean
    $showDeletedRecords: Boolean
  ) {
    form(id: $id) {
      records(
        first: $first
        afterCursor: $afterCursor
        filter: $filter
        archived: $showDeletedRecords
      ) {
        edges {
          node {
            id
            incrementalId
            data(display: $display)
            versions {
              id
              createdAt
              data
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
  }
`;

/** Model for GetFormRecordsQueryResponse */
export interface GetFormRecordsQueryResponse {
  form: {
    records: {
      edges: {
        node: Record;
        cursor: string;
      }[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
      totalCount: number;
    };
  };
}

/** Graphql query for getting a form by its id */
export const GET_FORM_BY_ID = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      name
      createdAt
      structure
      metadata {
        name
        canSee
      }
      fields
      status
      versions {
        id
        createdAt
        data
      }
      canUpdate
    }
  }
`;

/** Model for getFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  form: Form;
}
