import { Application } from './application.model';
import { Role } from './user.model';

/** Model for Channel object */
export interface Channel {
  id?: string;
  title?: string;
  application?: Application;
  subscribedRoles?: Role[];
  routingKey?: string;
}

/** Model for ChannelDisplay object */
export interface ChannelDisplay extends Channel {
  subscribedApplications?: {
    name: string;
    roles: Role[];
  }[];
}

/** Model for GetChannelsQueryResponse object */
export interface ChannelsQueryResponse {
  channels: Channel[];
}
