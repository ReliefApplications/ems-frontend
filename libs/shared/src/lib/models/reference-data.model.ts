import { Connection } from '../utils/public-api';
import { ApiConfiguration } from './api-configuration.model';
import { GraphqlNodesResponse } from './graphql-query.model';

/** Enum of referenceDataType. */
export enum referenceDataType {
  static = 'static',
  graphql = 'graphql',
  rest = 'rest',
}

/** Model for Reference data object. */
export interface ReferenceData {
  id?: string;
  name?: string;
  modifiedAt?: string;
  type?: referenceDataType;
  apiConfiguration?: ApiConfiguration;
  query?: string;
  fields?: { name: string; type: string }[];
  valueField?: string;
  path?: string;
  data?: any;
  graphQLFilter?: string;
  permissions?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

/** Model for reference data graphql query response */
export interface ReferenceDataQueryResponse {
  referenceData: ReferenceData;
}

/** Model for add reference data graphql mutation response */
export interface AddReferenceDataMutationResponse {
  addReferenceData: ReferenceData;
}

/** Model for edit reference data graphql mutation response */
export interface EditReferenceDataMutationResponse {
  editReferenceData: ReferenceData;
}

/** Model for delete reference data graphql mutation response */
export interface DeleteReferenceDataMutationResponse {
  deleteReferenceData: ReferenceData;
}

/** Model for reference datas nodes graphql query response */
export interface ReferenceDatasQueryResponse {
  referenceDatas: GraphqlNodesResponse<ReferenceData>;
}

/** Model for reference data connections graphql query response */
export interface ReferenceDatasConnectionsQueryResponse {
  referenceDatas: Connection<ReferenceData>;
}
