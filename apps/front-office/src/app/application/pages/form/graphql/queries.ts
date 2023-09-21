import { gql } from 'apollo-angular';

/**
 * Form query.
 */
export const GET_FORM_BY_ID = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      name
      structure
      fields
      status
      canUpdate
      canCreateRecords
      uniqueRecord {
        id
        modifiedAt
        data
      }
      metadata {
        name
        automated
        canSee
        canUpdate
      }
    }
  }
`;

/**
 * Workflow step query.
 */
export const GET_STEP_BY_ID = gql`
  query GetStepById($id: ID!) {
    step(id: $id) {
      id
      name
      createdAt
      modifiedAt
      content
      canSee
    }
  }
`;

/**
 * Application page query.
 */
export const GET_PAGE_BY_ID = gql`
  query GetPageById($id: ID!) {
    page(id: $id) {
      id
      name
      createdAt
      modifiedAt
      type
      content
      canSee
    }
  }
`;
