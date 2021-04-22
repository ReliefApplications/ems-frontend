import { Channel } from './channel.model';
import { User } from './user.model';

export interface Notification {
    id?: string;
    action?: string;
    content?: any;
    createdAt?: Date;
    channel?: Channel;
    seenBy?: User[];
}
