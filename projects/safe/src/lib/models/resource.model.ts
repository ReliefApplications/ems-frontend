import { Form } from './form.model';
import { Record } from './record.model';

/*  Model for Resource object.
*/
export interface Resource {
    id?: string;
    name?: string;
    forms?: Form[];
    relatedForms?: Form[];
    createdAt?: Date;
    records?: Record[];
    fields?: any;
    canSee?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    coreForm?: Form;
}
