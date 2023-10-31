import { gql } from 'apollo-angular';

// === GET DRAFT RECORDS ===

/** Graphql request for getting draft records */
export const GET_DRAFT_RECORDS = gql`
  query GetDraftRecords($formId: ID!) {
    draftRecords(formId: $formId) {
      id
      createdAt
      data
      form {
        id
        structure
        metadata {
          name
          automated
          canSee
          canUpdate
        }
      }
    }
  }
`;
