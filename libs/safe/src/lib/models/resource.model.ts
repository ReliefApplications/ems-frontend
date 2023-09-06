import { Connection } from '../utils/graphql/connection.type';
import { Aggregation } from './aggregation.model';
import { Form } from './form.model';
import { Layout } from './layout.model';
import { Metadata } from './metadata.model';
import { Record } from './record.model';

/** Model for Resource object. */
export interface Resource {
  id?: string;
  name?: string;
  queryName?: string;
  forms?: Form[];
  relatedForms?: Form[];
  createdAt?: Date;
  records?: Connection<Record>;
  fields?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  coreForm?: Form;
  layouts?: Connection<Layout>;
  aggregations?: Connection<Aggregation>;
  rolePermissions?: {
    canCreateRecords: any;
    canSeeRecords: any;
    canUpdateRecords: any;
    canDeleteRecords: any;
  };
  metadata?: Metadata[];
  canCreateRecords?: boolean;
}

/** Model for resource query response object */
export interface ResourceQueryResponse {
  resource: Resource;
}
