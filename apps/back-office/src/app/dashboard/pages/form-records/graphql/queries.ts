import { gql } from 'apollo-angular';

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
