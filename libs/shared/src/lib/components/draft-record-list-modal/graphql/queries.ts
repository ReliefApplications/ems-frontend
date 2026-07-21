import { gql } from 'apollo-angular';

/** Graphql request for getting draft records */
export const GET_DRAFT_RECORDS = gql`
  query GetDraftRecords($form: ID!) {
    records(form: $form, draft: true) {
      id
      incrementalId
      draft
      createdAt
      data
      form {
        id
        name
      }
    }
    form(id: $form) {
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
`;
