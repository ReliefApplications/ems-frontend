import { Record } from './record.model';
import { Resource } from './resource.model';

/* Model for Form object.
*/
export interface BasicForm {
    id?: string;
    name?: string;
    createdAt?: Date;
    status?: string;
    versionsCount?: number;
    recordsCount?: number;
    core?: boolean;
    canSee?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}
