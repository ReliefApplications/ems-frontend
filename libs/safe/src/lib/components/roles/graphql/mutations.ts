import { gql } from 'apollo-angular';
import { Group, Role } from '../../../models/user.model';

// === DELETE ROLE ===

/** Graphql request for deleting a role by its id */
export const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) {
    deleteRole(id: $id) {
      id
    }
  }
`;

/** Model for DeleteRoleMutationResponse object */
export interface DeleteRoleMutationResponse {
  deleteRole: Role;
}

// === ADD ROLE ===

/** Graphql request for adding a new role to an application */
export const ADD_ROLE = gql`
  mutation addRole($title: String!, $application: ID) {
    addRole(title: $title, application: $application) {
      id
      title
      permissions {
        id
        type
      }
    }
  }
`;

/** Model for AddRoleMutationResponse object */
export interface AddRoleMutationResponse {
  addRole: Role;
}

// === ADD GROUP ===

/** Graphql request for adding a new group to an application */
export const ADD_GROUP = gql`
  mutation addGroup($title: String!) {
    addGroup(title: $title) {
      id
      title
    }
  }
`;

/** Model for AddGroupMutationResponse object */
export interface AddGroupMutationResponse {
  addGroup: Group;
}

// === DELETE GROUP ===

/** Graphql request for deleting a group by its id */
export const DELETE_GROUP = gql`
  mutation deleteGroup($id: ID!) {
    deleteGroup(id: $id) {
      id
    }
  }
`;

/** Model for DeleteGroupMutationResponse object */
export interface DeleteGroupMutationResponse {
  deleteGroup: Group;
}

// === FETCH GROUPS FROM SERVICE ===
/** Graphql request for adding a new group to an application */
export const FETCH_GROUPS = gql`
  mutation FetchGroups {
    fetchGroups {
      id
      title
      usersCount
    }
  }
`;

/** Model for AddGroupMutationResponse object */
export interface FetchGroupsMutationResponse {
  fetchGroups: Group[];
}
