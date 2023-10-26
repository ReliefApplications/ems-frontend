import { gql } from 'apollo-angular';

// === ADD STEP ===

/** Graphql request for adding a new step of a given type to a workflow */
export const ADD_STEP = gql`
  mutation addStep($type: String!, $content: ID, $workflow: ID!) {
    addStep(type: $type, content: $content, workflow: $workflow) {
      id
      name
      type
      content
      createdAt
    }
  }
`;

// === EDIT STEP ===
/** Edit step gql mutation definition */
export const EDIT_STEP = gql`
  mutation editStep(
    $id: ID!
    $name: String
    $nextStepOnSave: Boolean
    $icon: String
    $type: String
    $content: ID
    $permissions: JSON
  ) {
    editStep(
      id: $id
      name: $name
      icon: $icon
      type: $type
      nextStepOnSave: $nextStepOnSave
      content: $content
      permissions: $permissions
    ) {
      id
      name
      icon
      type
      content
      nextStepOnSave
      createdAt
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
