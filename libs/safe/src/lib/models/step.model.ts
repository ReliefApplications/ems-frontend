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
}
