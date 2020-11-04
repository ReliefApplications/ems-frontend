import { Record } from './record.model';

/* Model for FormVersion object.
*/
interface Version {
    id?: string;
    createdAt?: Date;
    structure?: string;
}

/* Model for Form object.
*/
export interface Form {
    id?: string;
    name?: string;
    createdAt?: Date;
    structure?: string;
    status?: string;
    versions?: Version[];
    recordsCount?: number;
    core?: boolean;
    records?: Record[];
    fields?: any;
    canSee?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
}
