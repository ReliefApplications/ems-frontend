import { gql } from 'apollo-angular';
import { Role } from '../../../models/user.model';

/** Edit role mutation of role summary component */
export const EDIT_ROLE = gql`
  mutation editRole(
    $id: ID!
    $permissions: [ID]
    $channels: [ID]
    $title: String
    $description: String
  ) {
    editRole(
      id: $id
      permissions: $permissions
      channels: $channels
      title: $title
      description: $description
    ) {
      id
      title
      description
      application {
        id
      }
      permissions {
        id
        type
      }
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

/** Interface of edit role mutation */
export interface EditRoleMutationResponse {
  loading: boolean;
  editRole: Role;
}
