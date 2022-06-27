import { gql } from 'apollo-angular';
import { Role } from '../../../models/user.model';

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
    }
  }
`;

export interface GetRoleQueryResponse {
  loading: boolean;
  role: Role;
}
