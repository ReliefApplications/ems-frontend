import { gql } from 'apollo-angular';
import { Workflow } from '@safe/builder';

// === GET WORKFLOW BY ID ===

/** Graphql query for getting a workflow by its id */
export const GET_WORKFLOW_BY_ID = gql`
  query GetWorkflowById($id: ID!, $asRole: ID) {
    workflow(id: $id, asRole: $asRole) {
      id
      name
      createdAt
      modifiedAt
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
        application {
          id
        }
      }
    }
  }
`;

/** Model for GetWorkflowByIdQueryResponse object */
export interface GetWorkflowByIdQueryResponse {
  loading: boolean;
  workflow: Workflow;
}
