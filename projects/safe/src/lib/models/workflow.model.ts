import { Page } from './page.model';
import { Step } from './step.model';

/*  Model for Workflow object.
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
