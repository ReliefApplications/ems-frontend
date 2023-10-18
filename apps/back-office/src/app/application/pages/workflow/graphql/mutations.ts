import { gql } from 'apollo-angular';

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
