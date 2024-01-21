import { Connection } from '../utils/public-api';
import { Aggregation } from './aggregation.model';
import { ApiConfiguration } from './api-configuration.model';
import { GraphqlNodesResponse } from './graphql-query.model';

/** Enum of referenceDataType. */
export enum referenceDataType {
  static = 'static',
  graphql = 'graphql',
  rest = 'rest',
}

/** Enum of the available pagination methods */
export enum paginationStrategy {
  offset = 'offset',
  cursor = 'cursor',
  page = 'page',
}

/** Model for Reference data object. */
export interface ReferenceData {
  id?: string;
  name?: string;
  modifiedAt?: string;
  type?: referenceDataType;
  apiConfiguration?: ApiConfiguration;
  graphQLTypeName?: string;
  query?: string;
  fields?: { name: string; type: string; graphQLFieldName?: string }[];
  valueField?: string;
  path?: string;
  data?: any;
  graphQLFilter?: string;
  permissions?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  aggregations?: Connection<Aggregation>;
  // Pagination strategies
  //  offset: The client will send the offset (how many items to skip)
  //  cursor: The client will send the cursor of the last item
  //  page: The client will send the page number
  pageInfo?: {
    // JSON path that when queried to the API response will return the total number of items
    totalCountField: string;
    // Name of the query variable that corresponds to the page size
    pageSizeVar?: string;
  } & (
    | {
        strategy: 'offset';
        // Name of the query variable to be used for determining the offset
        offsetVar: string;
      }
    | {
        strategy: 'cursor';
        // JSON path that when queried to the API response will return the cursor
        cursorField: string;
        // Name of the query variable to be used for determining the cursor
        cursorVar: string;
      }
    | {
        strategy: 'page';
        // Name of the query variable that corresponds to the page number
        pageVar: string;
      }
  );
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
