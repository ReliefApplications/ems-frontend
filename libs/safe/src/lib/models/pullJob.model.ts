import { ApiConfiguration } from './api-configuration.model';
import { status } from './form.model';
import { Channel } from './channel.model';
import { Form } from './form.model';
import { GraphqlNodesResponse } from './graphql-query.model';

/** Model for PullJob object. */
export interface PullJob {
  id?: string;
  name?: string;
  status?: status;
  apiConfiguration?: ApiConfiguration;
  url?: string;
  path?: string;
  schedule?: string;
  convertTo?: Form;
  mapping?: any;
  uniqueIdentifiers?: string[];
  channel?: Channel;
}

/** Model for add pull job graphql mutation response */
export interface AddPullJobMutationResponse {
  addPullJob: PullJob;
}

/** Model for edit pull job graphql mutation response */
export interface EditPullJobMutationResponse {
  editPullJob: PullJob;
}

/** Model for delete pull job graphql mutation response */
export interface DeletePullJobMutationResponse {
  deletePullJob: PullJob;
}

/** Model for pull job nodes graphql query response */
export interface PullJobsNodesQueryResponse {
  pullJobs: GraphqlNodesResponse<PullJob>;
}
