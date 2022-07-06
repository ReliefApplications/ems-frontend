import { gql } from 'apollo-angular';
import { Page } from '../../../models/page.model';
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

/** Interface of edit role mutation response */
export interface EditRoleMutationResponse {
  loading: boolean;
  editRole: Role;
}

/** Edit Page Access mutation */
export const EDIT_PAGE_ACCESS = gql`
  mutation editPage($id: ID!, $permissions: JSON) {
    editPage(id: $id, permissions: $permissions) {
      id
      name
      type
      content
      permissions {
        canSee {
          id
        }
      }
    }
  }
`;

/** Interface of Edit Page Access mutation response */
export interface EditPageAccessMutationResponse {
  editPage: Page;
}
