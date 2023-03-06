import { gql } from 'apollo-angular';
import { Group, Role } from '../../../models/user.model';

// === GET ROLES ===

/** Graphql request for getting roles (optionally by an application id) */
export const GET_ROLES = gql`
  query GetRoles($application: ID) {
    roles(application: $application) {
      id
      title
      users {
        totalCount
      }
    }
  }
`;

/** Model for GetRolesQueryResponse object */
export interface GetRolesQueryResponse {
  roles: Role[];
}

/** Graphql request for getting groups */
export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      id
      title
      usersCount
    }
  }
`;

/** Model for GetGroupsQueryResponse object */
export interface GetGroupsQueryResponse {
  groups: Group[];
}
