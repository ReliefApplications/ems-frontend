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
