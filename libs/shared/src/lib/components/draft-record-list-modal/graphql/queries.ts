import { gql } from 'apollo-angular';

/** Graphql request for getting draft records */
export const GET_DRAFT_RECORDS = gql`
  query GetDraftRecords(
    $form: ID!
    $first: Int!
    $skip: Int!
    $sortField: String!
    $sortOrder: String!
  ) {
    draftRecords(
      form: $form
      first: $first
      skip: $skip
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      totalCount
      edges {
        node {
          id
          createdAt
          modifiedAt
        }
      }
    }
  }
`;

/** GraphQL request for loading a selected draft's form data. */
export const GET_DRAFT_RECORD = gql`
  query GetDraftRecord($id: ID!) {
    record(id: $id, recordVisibility: ownDrafts) {
      id
      data
    }
  }
`;
