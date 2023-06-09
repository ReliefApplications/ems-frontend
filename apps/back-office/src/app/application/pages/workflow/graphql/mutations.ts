import { gql } from 'apollo-angular';
import { Workflow, Step, Page, Form } from '@oort-front/safe';

// === EDIT WORKFLOW ===
/** Edit workflow gql mutation definition */
export const EDIT_WORKFLOW = gql`
  mutation editWorkflow($id: ID!, $name: String, $steps: [ID]) {
    editWorkflow(id: $id, name: $name, steps: $steps) {
      id
      name
    }
  }
`;

/** Edit workflow gql mutation response interface */
export interface EditWorkflowMutationResponse {
  editWorkflow: Workflow;
}

// === DELETE STEP ===
/** Delete step gql mutation definition */
export const DELETE_STEP = gql`
  mutation deleteStep($id: ID!) {
    deleteStep(id: $id) {
      id
      name
    }
  }
`;

/** Delete step gql mutation response interface */
export interface DeleteStepMutationResponse {
  deleteStep: Step;
}

// === EDIT PAGE ===
/** Edit page gql mutation definition */
export const EDIT_PAGE = gql`
  mutation editPage($id: ID!, $name: String, $visible: Boolean, $permissions: JSON) {
    editPage(id: $id, name: $name, visible: $visible, permissions: $permissions) {
      id
      name
      visible
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

/** Edit page gql mutation response interface */
export interface EditPageMutationResponse {
  editPage: Page;
}

// === EDIT PAGE VISIBILITY ===
/** Edit page gql mutation definition */
export const EDIT_PAGE_VISIBILITY = gql`
  mutation editPageVisibility($id: ID!, $visible: Boolean) {
    editPageVisibility(id: $id, visible: $visible) {
      id
      visible
    }
  }
`;

/** Edit page gql mutation response interface */
export interface EditPageVisibilityMutationResponse {
  editPageVisibility: Page;
}

// === ADD FORM ===
/** Add form gql mutation definition */
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

/** Add form gql mutation response interface */
export interface AddFormMutationResponse {
  addForm: Form;
}
