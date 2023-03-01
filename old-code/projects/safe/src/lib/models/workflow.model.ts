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
}
