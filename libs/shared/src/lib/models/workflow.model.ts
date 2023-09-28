import { Page } from './page.model';
import { Step } from './step.model';

/**
 * Workflow interface.
 */
export interface Workflow {
  id?: string;
  name?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  steps?: Step[];
  permissions?: any;
  page?: Page;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  nextStepOnSave?: boolean;
}

/** Model for workflow query response */
export interface WorkflowQueryResponse {
  workflow: Workflow;
}

/** Model for workflow graphql mutation response */
export interface EditWorkflowMutationResponse {
  editWorkflow: Workflow;
}
