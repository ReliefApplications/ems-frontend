import { Workflow } from './workflow.model';
import { ContentType } from './page.model';

/** Model for Step object. */
export interface Step {
  id?: string;
  name?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  type?: ContentType;
  content?: string;
  settings?: any;
  permissions?: any;
  workflow?: Workflow;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  icon?: string;
  nextStepOnSave?: boolean;
}

/** Model for step graphql query response */
export interface StepQueryResponse {
  step: Step;
}

/** Model for add step graphql mutation edit response */
export interface AddStepMutationResponse {
  addStep: Step;
}

/** Model for edit step graphql mutation edit response */
export interface EditStepMutationResponse {
  editStep: Step;
}

/** Model for delete step graphql mutation delete response */
export interface DeleteStepMutationResponse {
  deleteStep: Step;
}
