import { Page } from './page.model';
import { Role } from './user.model';

/*  Model for Application object.
*/
export interface Application {
    id?: string;
    name?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    pages?: Page[];
    roles?: Role[];
    settings?: any;
    permissions?: any;
    canSee?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}
