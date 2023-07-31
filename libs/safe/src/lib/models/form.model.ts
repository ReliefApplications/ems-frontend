import { Connection } from '../utils/graphql/connection.type';
import { Aggregation } from './aggregation.model';
import { Layout } from './layout.model';
import { Metadata } from './metadata.model';
import { Record } from './record.model';
import { Resource } from './resource.model';

/**
 * Model for FormVersion object.
 */
export interface Version {
  id?: string;
  createdAt?: Date;
  data?: string;
}

/**
 * Enum of status.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum status {
  active = 'active',
  pending = 'pending',
  archived = 'archived',
}

/**
 * Model for Form object.
 */
export interface Form {
  id?: string;
  name?: string;
  queryName?: string;
  createdAt?: Date;
  structure?: string;
  status?: status;
  versions?: Version[];
  recordsCount?: number;
  core?: boolean;
  records?: Connection<Record>;
  fields?: any[];
  permissions?: any;
  resource?: Resource;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  canCreateRecords?: boolean;
  uniqueRecord?: Record;
  layouts?: Connection<Layout>;
  aggregations?: Connection<Aggregation>;
  metadata?: Metadata[];
}
