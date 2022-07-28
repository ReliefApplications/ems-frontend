import { gql } from 'apollo-angular';
import { Role } from '../../../models/user.model';

// === GET ROLES ===

/** Graphql request for getting roles (optionnally by an application id) */
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
