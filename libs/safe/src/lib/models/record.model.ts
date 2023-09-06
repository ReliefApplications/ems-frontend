import { Form } from './form.model';
import { User } from './user.model';

/** Model for version attributes. */
interface Version {
  id?: string;
  createdAt?: Date;
  data?: string;
  createdBy?: User;
}

/** Model for Record object. */
export interface Record {
  id?: string;
  incrementalId?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  deleted?: boolean;
  data?: any;
  form?: Form;
  versions?: Version[];
  createdBy?: User;
  modifiedBy?: User;
  canUpdate?: boolean;
  canDelete?: boolean;
  validationErrors?: { question: string; errors: string[] }[];
}

/** Model for record query response object */
export interface RecordQueryResponse {
  record: Record;
}
