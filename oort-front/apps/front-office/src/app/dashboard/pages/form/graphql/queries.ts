import { gql } from 'apollo-angular';
import { Form, Step, Page } from '@oort-front/safe';

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
 * Interface of form query response.
 */
export interface GetFormByIdQueryResponse {
  /** Loading state of the query */

  /** Application form */
  form: Form;
}

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
 * Interface of workflow step query response.
 */
export interface GetStepByIdQueryResponse {
  /** Loading state of the query */

  /** Application step */
  step: Step;
}

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

/**
 * Interface of application page query.
 */
export interface GetPageByIdQueryResponse {
  /** Loading state of the query */

  /** Application page */
  page: Page;
}
