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
  userAccessToFields?: {
    [key: string]: { canSee: boolean; canUpdate: boolean };
  };
  fields?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  coreForm?: Form;
  layouts?: Layout[];
  rolePermissions?: {
    canCreateRecords: any;
    canSeeRecords: any;
    canUpdateRecords: any;
    canDeleteRecords: any;
  };
  metadata: any[];
}
