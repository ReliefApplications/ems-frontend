import { status } from './form.model';

/** Enum of authType. */
// eslint-disable-next-line @typescript-eslint/naming-convention
export enum authType {
  public = 'public',
  serviceToService = 'serviceToService',
  userToService = 'userToService',
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
