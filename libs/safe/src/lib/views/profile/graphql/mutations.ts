import { gql } from 'apollo-angular';

// === EDIT USER PROFILE ===

/** Graphql request for editing the user profile */
export const EDIT_USER_PROFILE = gql`
  mutation editUserProfile($profile: UserProfileInputType!) {
    editUserProfile(profile: $profile) {
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
      favoriteApp
    }
  }
`;
