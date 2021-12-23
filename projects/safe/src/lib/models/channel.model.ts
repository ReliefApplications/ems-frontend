import { Application } from './application.model';
import { Role } from './user.model';

export interface Channel {
    id?: string;
    title?: string;
    application?: Application;
    subscribedRoles?: Role[];
    routingKey?: string;
}

export interface ChannelDisplay extends Channel {
    subscribedApplications?: {
        name: string;
        roles: Role[];
    }[];
}
