import { Step } from './step.model';
import { Page } from './page.model';

/*  Model for Dashboard object.
*/
export interface Dashboard {
    id?: string;
    name?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    structure?: any;
    layout?: any;
    permissions?: any;
    canSee?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    page?: Page;
    step?: Step;
}
