import gql from 'graphql-tag';
import { Workflow } from '@oort-front/safe';

// === GET WORKFLOW BY ID ===
/** Get workflow query */
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

/** Get workflow query response */
export interface GetWorkflowByIdQueryResponse {
  workflow: Workflow;
}
