import { gql } from 'apollo-angular';
import { Channel } from '../../../models/channel.model';
import { Permission, Role } from '../../../models/user.model';

/** Get role by id GraphQL query */
export const GET_ROLE = gql`
  query GetRole($id: ID!) {
    role(id: $id) {
      id
      title
      description
      permissions {
        id
        type
      }
      application {
        id
      }
    }
  }
`;

/** Interface of Get role query */
export interface GetRoleQueryResponse {
  loading: boolean;
  role: Role;
}

/** Graphql request for getting permissions */
export const GET_PERMISSIONS = gql`
  query GetPermissions($application: Boolean) {
    permissions(application: $application) {
      id
      type
      global
    }
  }
`;

/** Model for GetPermissionsQueryResponse object */
export interface GetPermissionsQueryResponse {
  loading: boolean;
  permissions: Permission[];
}

/** Graphql request for getting channels (optionnally by an application id) */
export const GET_CHANNELS = gql`
  query getChannels($application: ID) {
    channels(application: $application) {
      id
      title
      application {
        id
        name
      }
    }
  }
`;

/** Model for GetChannelsQueryResponse object */
export interface GetChannelsQueryResponse {
  loading: boolean;
  channels: Channel[];
}
