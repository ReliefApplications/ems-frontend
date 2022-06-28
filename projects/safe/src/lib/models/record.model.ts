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
}

/** Model for RecordConnection object */
export interface RecordConnection {
  totalCount?: number;
  edges?: {
    node?: Record;
    cursor?: string;
  }[];
  pageInfo?: {
    startCursor?: string;
    endCursor?: string;
    hasNextPage?: boolean;
  };
}
