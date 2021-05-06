import { Form } from './form.model';
import { User } from './user.model';

interface Version {
    id?: string;
    createdAt?: Date;
    data?: string;
    createdBy?: User;
}

/*  Model for Record object.
*/
export interface Record {
    id?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    deleted?: boolean;
    data?: any;
    form?: Form;
    versions?: Version[];
    createdBy?: User;
    canUpdate?: boolean;
    canDelete?: boolean;
}
