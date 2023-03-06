import { gql } from 'apollo-angular';
import { Step } from '../../../models/step.model';

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

/** Model for AddStepMutationResponse object */
export interface AddStepMutationResponse {
  addStep: Step;
}
