import { Page } from './page.model';
import { Step } from './step.model';

/**
 * Content type interface.
 */
export interface IContentType {
    value: string;
    name: string;
    img: string;
    color: string;
    focusColor: string;
}

/**
 * Available content types.
 */
export const CONTENT_TYPES: IContentType[] = [
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
