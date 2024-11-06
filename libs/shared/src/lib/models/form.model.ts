import { Connection } from '../utils/graphql/connection.type';
import { Aggregation } from './aggregation.model';
import { GraphqlNodesResponse } from './graphql-query.model';
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

/** Model for form graphql graphql query response */
export interface FormQueryResponse {
  form: Form;
}

/** Model for add form graphql mutation response */
export interface AddFormMutationResponse {
  addForm: Form;
}

/** Model for edit form graphql mutation response */
export interface EditFormMutationResponse {
  editForm: Form;
}

/** Model for delete form graphql mutation response */
export interface DeleteFormMutationResponse {
  deleteForm: Form;
}

/** Model for form records graphql query response */
export interface FormRecordsQueryResponse {
  form: {
    records: GraphqlNodesResponse<Record>;
  };
}

/** Model for forms graphql query response */
export interface FormsQueryResponse {
  forms: GraphqlNodesResponse<Form>;
}
