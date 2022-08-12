import { gql } from 'apollo-angular';
import { Group, Role } from '../../../models/user.model';

// === GET ROLES ===

/** Graphql request for getting roles (optionally by an application id) */
export const GET_ROLES = gql`
  query GetRoles($application: ID) {
    roles(application: $application) {
      id
      title
      permissions {
        id
        type
      }
      usersCount
      channels {
        id
        title
        application {
          id
          name
        }
      }
    }
  }
`;

/** Model for GetRolesQueryResponse object */
export interface GetRolesQueryResponse {
  loading: boolean;
  roles: Role[];
}

/** Graphql request for getting groups */
export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      manualCreation
      values {
        id
        title
        usersCount
      }
    }
  }
`;

/** Model for GetGroupsQueryResponse object */
export interface GetGroupsQueryResponse {
  loading: boolean;
  groups: {
    manualCreation: boolean;
    values: Group[];
  };
}
