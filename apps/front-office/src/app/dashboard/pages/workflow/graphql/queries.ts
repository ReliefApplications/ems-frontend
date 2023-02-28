import { gql } from 'apollo-angular';
import { Form, Workflow, Step, Page } from '@oort-front/safe';

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
 * Workflow query.
 */
export const GET_WORKFLOW_BY_ID = gql`
  query GetWorkflowById($id: ID!) {
    workflow(id: $id) {
      id
      name
      createdAt
      modifiedAt
      steps {
        id
        name
        type
        content
        createdAt
      }
      page {
        id
        name
        canUpdate
        permissions {
          canSee {
            id
            title
          }
          canUpdate {
            id
            title
          }
          canDelete {
            id
            title
          }
        }
      }
    }
  }
`;

/**
 * Interface of workflow query response.
 */
export interface GetWorkflowByIdQueryResponse {
  /** Loading state of the query */

  /** Application workflow */
  workflow: Workflow;
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
