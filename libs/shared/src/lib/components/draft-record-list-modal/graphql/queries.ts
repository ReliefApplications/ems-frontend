import { gql } from 'apollo-angular';

/** Graphql request for getting draft records */
export const GET_DRAFT_RECORDS = gql`
  query GetDraftRecords($form: ID!) {
    draftRecords(form: $form) {
      id
      createdAt
      data
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
