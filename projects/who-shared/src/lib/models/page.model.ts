import { Application } from './application.model';

/*  Enum of content types.
*/
export enum ContentType {
    workflow = 'workflow',
    dashboard = 'dashboard',
    form = 'form'
}
/*  Model for Page object.
*/
export interface Page {
    id?: string,
    name?: string,
    createdAt?: Date,
    modifiedAt?: Date,
    type?: ContentType,
    content?: string,
    settings?: any,
    permissions?: any,
    application?: Application
}

