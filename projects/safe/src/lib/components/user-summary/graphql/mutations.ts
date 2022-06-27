import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';

/** Graphql request for editing the user profile */
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

/** Model for EditUserProfileMutationResponse object */
export interface EditUserProfileMutationResponse {
  loading: boolean;
  editUserProfile: User;
}
