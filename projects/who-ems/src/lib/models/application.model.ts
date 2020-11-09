import { Page } from './page.model';

/*  Model for Application object.
*/
export interface Application {
    id?: string;
    name?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    pages?: Page[];
    settings?: any;
    permissions?: any;
    canSee?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}
