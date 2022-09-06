import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';

/** Edit User profile mutation */
export const EDIT_USER_PROFILE = gql`
  mutation editUserProfile($profile: UserProfileInputType!, $id: ID!) {
    editUserProfile(profile: $profile, id: $id) {
      id
      username
      name
      firstName
      lastName
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

/** Interface of Edit User Profile mutation */
export interface EditUserProfileMutationResponse {
  loading: boolean;
  editUserProfile: User;
}

/** Edit User roles Mutation */
export const EDIT_USER_ROLES = gql`
  mutation editUser($id: ID!, $roles: [ID], $groups: [ID], $application: ID) {
    editUser(
      id: $id
      roles: $roles
      groups: $groups
      application: $application
    ) {
      id
      username
      name
      firstName
      lastName
      roles {
        id
        title
        application {
          id
        }
      }
      groups {
        id
        title
      }
      oid
    }
  }
`;

/** Interface of Edit User Roles mutation */
export interface EditUserRolesMutationResponse {
  loading: boolean;
  editUser: User;
}
