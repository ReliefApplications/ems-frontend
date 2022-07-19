import { Form } from './form.model';
import { Layout } from './layout.model';
import { RecordConnection } from './record.model';

/** Model for Resource object. */
export interface Resource {
  id?: string;
  name?: string;
  queryName?: string;
  forms?: Form[];
  relatedForms?: Form[];
  createdAt?: Date;
  records?: RecordConnection;
  fields?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  coreForm?: Form;
  layouts?: Layout[];
}
