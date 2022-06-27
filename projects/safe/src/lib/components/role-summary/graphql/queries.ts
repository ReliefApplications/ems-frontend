import { gql } from 'apollo-angular';
import { Permission, Role } from '../../../models/user.model';

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
