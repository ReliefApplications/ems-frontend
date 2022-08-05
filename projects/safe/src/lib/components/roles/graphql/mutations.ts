import { gql } from 'apollo-angular';
import { Role } from '../../../models/user.model';

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
  loading: boolean;
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
      usersCount
    }
  }
`;

/** Model for AddRoleMutationResponse object */
export interface AddRoleMutationResponse {
  loading: boolean;
  addRole: Role;
}
