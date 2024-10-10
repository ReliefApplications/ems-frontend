import { gql } from 'apollo-angular';

// === GET PROFILE ===
/** Graphql request for getting profile of the current user */
export const GET_PROFILE = gql`
  {
    me {
      id
      firstName
      lastName
      username
      isAdmin
      name
      attributes
      roles {
        id
        title
        application {
          id
          shortcut
        }
        permissions {
          id
        }
      }
      permissions {
        id
        type
        global
      }
      applications {
        id
        shortcut
        positionAttributes {
          value
        }
        name
      }
      oid
      favoriteApp
    }
  }
`;
