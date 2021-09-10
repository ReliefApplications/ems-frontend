import { status } from './form.model';

/*  Enum of authType.
*/
export enum authType {
    serviceToService = 'serviceToService',
    userToService = 'userToService'
}


/*  Model for ApiConfiguration object.
*/
export interface ApiConfiguration {
    id?: string;
    name?: string;
    status?: status;
    authType?: authType;
    endpoint?: string;
    pingUrl?: string;
    settings?: any;
    permissions?: any;
    canSee?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}
