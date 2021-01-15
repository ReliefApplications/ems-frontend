import { Form, Version } from './form.model';
/*  Model for Record object.
*/
export interface Record {
    id?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    deleted?: boolean;
    data?: any;
    form?: Form;
    versions?: Version;
    createdBy?: any;
}
