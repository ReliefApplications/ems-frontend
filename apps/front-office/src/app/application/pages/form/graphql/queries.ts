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
      showName
      createdAt
      modifiedAt
      content
      canSee
      buttons
      workflow {
        name
      }
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
      showName
      createdAt
      modifiedAt
      type
      content
      canSee
      buttons
    }
  }
`;

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      data
      createdAt
      createdBy {
        name
      }
      modifiedAt
      modifiedBy {
        name
      }
      canUpdate
    }
  }
`;
