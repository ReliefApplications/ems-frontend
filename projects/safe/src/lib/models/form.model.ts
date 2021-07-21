import { Record } from './record.model';
import { Resource } from './resource.model';

/* Model for FormVersion object.
*/
export interface Version {
    id?: string;
    createdAt?: Date;
    data?: string;
}

/*  Enum of status.
*/
export enum status {
    active = 'active',
    pending = 'pending',
    archived = 'archived'
}

/* Model for Form object.
*/
export interface Form {
    id?: string;
    name?: string;
    createdAt?: Date;
    structure?: string;
    status?: status;
    versions?: Version[];
    recordsCount?: number;
    core?: boolean;
    records?: Record[];
    fields?: any[];
    permissions?: any;
    resource?: Resource;
    canSee?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    canCreateRecords?: boolean;
    uniqueRecord?: Record;
}
