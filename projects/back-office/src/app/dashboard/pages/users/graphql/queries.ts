import { gql } from 'apollo-angular';
import { Role, User } from '@safe/builder';

// === GET ROLES ===
/** Graphql query for getting roles (of an application or all) */
export const GET_ROLES = gql`
  query GetRoles($all: Boolean, $application: ID) {
    roles(all: $all, application: $application) {
      id
      title
      permissions {
        id
        type
      }
      usersCount
      application {
        name
      }
    }
  }
`;

/** Model for GetRolesQueryResponse object */
export interface GetRolesQueryResponse {
  roles: Role[];
}

// === GET USERS ===
/** Graphql query for getting users */
export const GET_USERS = gql`
  {
    users {
      id
      username
      name
      roles {
        id
        title
        application {
          id
        }
      }
      oid
    }
  }
`;

/** Model for GetUsersQueryResponse object */
export interface GetUsersQueryResponse {
  users: User[];
}
