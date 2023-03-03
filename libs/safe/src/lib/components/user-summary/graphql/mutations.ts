import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';
import { USER_FIELDS } from './fragments';

/** Edit User profile mutation */
export const EDIT_USER_PROFILE = gql`
  mutation editUserProfile($profile: UserProfileInputType!, $id: ID!) {
    editUserProfile(profile: $profile, id: $id) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

/** Interface of Edit User Profile mutation */
export interface EditUserProfileMutationResponse {
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
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

/** Interface of Edit User Roles mutation */
export interface EditUserRolesMutationResponse {
  editUser: User;
}
