import { Page } from './page.model';
import { Channel } from './channel.model';
import { Role, User } from './user.model';
import { Subscription } from './subscription.model';

/*  Model for Application object.
*/
export interface Application {
    id?: string;
    name?: string;
    description?: string;
    createdAt?: Date;
    modifiedAt?: Date;
    pages?: Page[];
    roles?: Role[];
    users?: User[];
    usersCount?: number;
    settings?: any;
    permissions?: any;
    channels?: Channel[];
    canSee?: boolean;
    canCreate?: boolean;
    canUpdate?: boolean;
    canDelete?: boolean;
    subscriptions?: Subscription[];
}
