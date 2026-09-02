import { Connection } from '../utils/graphql/connection.type';
import { Aggregation } from './aggregation.model';
import { Form } from './form.model';
import { GraphqlNodesResponse } from './graphql-query.model';
import { Layout } from './layout.model';
import { Metadata } from './metadata.model';
import { Record } from './record.model';

/** Severity of a uniqueness rule violation */
export type UniquenessRuleSeverity = 'error' | 'warning';

/** A single 'only apply when' condition of a uniqueness rule. */
export interface UniquenessCondition {
  field: string;
  operator: 'eq' | 'ne';
  value: any;
}

/** Model for a scoped uniqueness rule configured on a resource. */
export interface UniquenessRule {
  name?: string;
  fields: string[];
  severity: UniquenessRuleSeverity;
  message?: string;
  /** Restricts the rule to records matching all these conditions. */
  condition?: UniquenessCondition[];
  /** When set, checks for overlapping date ranges instead of an exact value match. */
  dateIntersection?: {
    startField: string;
    endField: string;
    allowAdjacent?: boolean;
  };
}

/** Model for Resource object. */
export interface Resource {
  id?: string;
  name?: string;
  singleQueryName?: string;
  queryName?: string;
  forms?: Form[];
  relatedForms?: Form[];
  createdAt?: Date;
  records?: Connection<Record>;
  fields?: any;
  uniquenessRules?: UniquenessRule[];
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
    canDownloadRecords: any;
    canUploadRecords: any;
  };
  metadata?: Metadata[];
  canCreateRecords?: boolean;
}

/** Model for resource query response object */
export interface ResourceQueryResponse {
  resource: Resource;
}

/** Model for edit resource mutation response object */
export interface EditResourceMutationResponse {
  editResource: Resource;
}

/** Model for delete resource mutation response object */
export interface DeleteResourceMutationResponse {
  deletedResource: Resource;
}

/** Model for resource records query response object */
export interface ResourceRecordsNodesQueryResponse {
  resource: { records: GraphqlNodesResponse<Record> };
}

/** Model for resources query response object */
export interface ResourcesQueryResponse {
  resources: GraphqlNodesResponse<Resource>;
}

/** Model for resources connections graphql query response */
export interface ResourcesConnectionQueryResponse {
  resources: Connection<Resource>;
}

/** Model for resource records connections graphql query Response response */
export interface ResourceRecordsConnectionsQueryResponse {
  resource: {
    records: Connection<Record>;
  };
}
