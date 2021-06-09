/*  Enum of authType.
*/
export enum status {
    active = 'active',
    pending = 'pending',
    archived = 'archived'
}

/*  Enum of authType.
*/
export enum authType {
    serviceToService = 'service-to-service',
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
