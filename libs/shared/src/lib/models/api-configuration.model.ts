import { status } from './form.model';
import { GraphqlNodesResponse } from './graphql-query.model';

/** Enum of authType. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum authType {
  public = 'public',
  serviceToService = 'serviceToService',
  userToService = 'userToService',
  authorizationCode = 'authorizationCode',
}

/** Model for ApiConfiguration object. */
export interface ApiConfiguration {
  id?: string;
  name?: string;
  status?: status;
  authType?: authType;
  endpoint?: string;
  graphQLEndpoint?: string;
  pingUrl?: string;
  settings?: any;
  permissions?: any;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

/** Model for API configuration graphql query response */
export interface ApiConfigurationQueryResponse {
  apiConfiguration: ApiConfiguration;
}

/** Model for delete API configuration graphql mutation response */
export interface DeleteApiConfigurationMutationResponse {
  deleteApiConfiguration: ApiConfiguration;
}

/** Model for add API configuration graphql mutation response */
export interface AddApiConfigurationMutationResponse {
  addApiConfiguration: ApiConfiguration;
}

/** Model for edit API configuration graphql mutation response */
export interface EditApiConfigurationMutationResponse {
  editApiConfiguration: ApiConfiguration;
}

/** Model for API configuration nodes graphql query response */
export interface ApiConfigurationsQueryResponse {
  apiConfigurations: GraphqlNodesResponse<ApiConfiguration>;
}
