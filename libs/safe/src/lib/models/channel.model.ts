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

/** Model for add channel mutation response */
export interface AddChannelMutationResponse {
  addChannel: Channel;
}

/** Model for edit channel mutation response */
export interface EditChannelMutationResponse {
  editChannel: Channel;
}

/** Model for delete channel mutation response */
export interface DeleteChannelMutationResponse {
  deleteChannel: Channel;
}

/** Model for channels query response */
export interface ChannelsQueryResponse {
  channels: Channel[];
}
