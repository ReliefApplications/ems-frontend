import { Page } from './page.model';

/*  Model for Workflow object.
*/
export interface Workflow {
    id?: string;
    name?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    steps?: any;
    permissions?: any;
    page?: Page;
}
