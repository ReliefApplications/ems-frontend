import { Form } from '@oort-front/shared';
import { gql } from 'apollo-angular';

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
      canUpdate
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
  form: Required<
    Pick<
      Form,
      | 'id'
      | 'name'
      | 'createdAt'
      | 'structure'
      | 'metadata'
      | 'fields'
      | 'status'
      | 'canUpdate'
      | 'records'
    >
  >;
}
