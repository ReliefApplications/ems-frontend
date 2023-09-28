import { Connection } from '../utils/graphql/connection.type';
import { Aggregation } from './aggregation.model';
import { Form } from './form.model';
import { GraphqlNodesResponse } from './graphql-query.model';
import { Layout } from './layout.model';
import { Metadata } from './metadata.model';
import { Record } from './record.model';

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

/** Model for duplicate resource mutation response object */
export interface DuplicateResourceMutationResponse {
  duplicatedResource: Resource;
}
