import { Form } from './form.model';
import { User } from './user.model';

/** Model for version attributes. */
interface Version {
  id?: string;
  createdAt?: Date;
  data?: string;
  createdBy?: User;
}

/** Model for Draft Record object. */
export interface DraftRecord {
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

/** Model for draft records graphql query response */
export interface DraftRecordsQueryResponse {
  draftRecords: DraftRecord[];
}
