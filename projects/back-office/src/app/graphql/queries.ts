import gql from 'graphql-tag';
import { Role, User } from 'who-shared';

// === GET USERS ===
export const GET_USERS = gql`
{
  users {
    id
    username
    name
    roles {
      id
      title
    }
    oid
  }
}`;

export interface GetUsersQueryResponse {
  loading: boolean;
  users: User[];
}

// === GET ROLES ===
export const GET_ROLES = gql`
{
  roles {
    id
    title
    permissions {
      id
      type
    }
    usersCount
  }
}`;

export interface GetRolesQueryResponse {
  loading: boolean;
  roles: Role[];
}
