import { gql } from 'apollo-angular';
import { Workflow, Step, Page, Form } from '@safe/builder';

// === EDIT WORKFLOW ===
export const EDIT_WORKFLOW = gql`
  mutation editWorkflow($id: ID!, $name: String, $steps: [ID]) {
    editWorkflow(id: $id, name: $name, steps: $steps) {
      id
      name
    }
  }
`;

export interface EditWorkflowMutationResponse {
  loading: boolean;
  editWorkflow: Workflow;
}

// === DELETE STEP ===
export const DELETE_STEP = gql`
  mutation deleteStep($id: ID!) {
    deleteStep(id: $id) {
      id
      name
    }
  }
`;

export interface DeleteStepMutationResponse {
  loading: boolean;
  deleteStep: Step;
}

// === EDIT PAGE ===
export const EDIT_PAGE = gql`
  mutation editPage($id: ID!, $name: String, $permissions: JSON) {
    editPage(id: $id, name: $name, permissions: $permissions) {
      id
      name
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
`;

export interface EditPageMutationResponse {
  loading: boolean;
  editPage: Page;
}

// === ADD FORM ===
export const ADD_FORM = gql`
  mutation addForm($name: String!, $resource: ID, $template: ID) {
    addForm(name: $name, resource: $resource, template: $template) {
      id
      name
      createdAt
      status
      versions {
        id
      }
    }
  }
`;

export interface AddFormMutationResponse {
  loading: boolean;
  addForm: Form;
}
