import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Application } from './application.model';
import { Channel } from './channel.model';
import { PositionAttribute } from './position-attribute.model';
import { GraphqlNodesResponse } from './graphql-query.model';

/** Model for Permission object. */
export interface Permission {
  id?: string;
  type?: string;
  global?: boolean;
}

/** Model for Role object. */
export interface Role {
  id?: string;
  title?: string;
  description?: string;
  usersCount?: number;
  permissions?: Permission[];
  application?: Application;
  channels?: Channel[];
  autoAssignment?: CompositeFilterDescriptor[];
}

/** Model for Group object. */
export interface Group {
  id?: string;
  title?: string;
  description?: string;
  usersCount?: number;
}

/** Model for User object. */
export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  isAdmin?: boolean;
  name?: string;
  roles?: Role[];
  groups?: Group[];
  permissions?: Permission[];
  oid?: string;
  applications?: Application[];
  positionAttributes?: PositionAttribute[];
  favoriteApp?: string;
  attributes?: any;
}

/** Model for user graphql query response */
export interface UserQueryResponse {
  user: User;
}

/** Model for edit user graphql mutation response */
export interface EditUserMutationResponse {
  editUser: User;
}

/** Model for edit user profile graphql mutation response */
export interface EditUserProfileMutationResponse {
  editUserProfile: User;
}

/** Query response for users using cursor */
export interface UsersNodeQueryResponse {
  users: GraphqlNodesResponse<User>;
}

/** Model for add users graphql mutation response */
export interface AddUsersMutationResponse {
  addUsers: User[];
}

/** Model for delete users graphql mutation response */
export interface DeleteUsersMutationResponse {
  deleteUsers: number;
}

/** Model for groups graphql query response */
export interface GroupsQueryResponse {
  groups: Group[];
}

/** Model for fetch groups graphql mutation response */
export interface FetchGroupsMutationResponse {
  fetchGroups: Group[];
}

/** Model for add group graphql mutation response */
export interface AddGroupMutationResponse {
  addGroup: Group;
}

/** Model for delete group graphql mutation response */
export interface DeleteGroupMutationResponse {
  deleteGroup: Group;
}

/** Model for role graphql query response */
export interface RoleQueryResponse {
  role: Role;
}

/** Model for add role graphql mutation response */
export interface AddRoleMutationResponse {
  addRole: Role;
}

/** Model for edit role graphql mutation response */
export interface EditRoleMutationResponse {
  editRole: Role;
}

/** Model for delete role graphql mutation response */
export interface DeleteRoleMutationResponse {
  deleteRole: Role;
}

/** Model for roles graphql query response */
export interface RolesQueryResponse {
  roles: Role[];
}

/** Model for roles from applications graphql query response */
export interface RolesFromApplicationsQueryResponse {
  rolesFromApplications: Role[];
}

/** Model for permissions graphql query response */
export interface PermissionsQueryResponse {
  permissions: Permission[];
}

/** Model for role users nodes graphql query response */
export interface RoleUsersNodesQueryResponse {
  role: {
    users: GraphqlNodesResponse<User>;
  };
}

/** Model for add role to users mutation response */
export interface AddRoleToUsersMutationResponse {
  addRoleToUsers: User[];
}

/** Model for delete users from application mutation response */
export interface DeleteUsersFromApplicationMutationResponse {
  deleteUsersFromApplication: User[];
}

/** Model for profile query response */
export interface ProfileQueryResponse {
  me: User;
}

/** Model for edit profile mutation response */
export interface EditUserProfileMutationResponse {
  editUserProfile: User;
}

/** Model for application users nodes query response */
export interface ApplicationUsersQueryResponse {
  application: {
    users: GraphqlNodesResponse<User>;
  };
}
