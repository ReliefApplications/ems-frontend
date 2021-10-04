import { Application } from './application.model';

/*  Enum of content types.
*/
export enum ContentType {
    workflow = 'workflow',
    dashboard = 'dashboard',
    form = 'form'
}

export interface IContentType {
    value: string;
    name: string;
    img: string;
    color: string;
    focusColor: string;
}

export const CONTENT_TYPES: IContentType[] = [
    {
        value: 'workflow',
        name: 'workflow',
        img: '/assets/workflow.svg',
        color: '#C6E6EA33',
        focusColor: '#8CCDD5'
    },
    {
        value: 'dashboard',
        name: 'dashboard',
        img: '/assets/dashboard.svg',
        color: '#F6C48133',
        focusColor: '#F6C481'
    },
    {
        value: 'form',
        name: 'form',
        img: '/assets/form.svg',
        color: '#C5D3FC33',
        focusColor: '#92ADFF'
    }
];

/*  Model for Page object.
*/
export interface Page {
    id?: string;
    name?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    type?: ContentType;
    content?: string;
    settings?: any;
    permissions?: any;
    application?: Application;
    canSee?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}

