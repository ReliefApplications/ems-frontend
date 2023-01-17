import { gql } from 'apollo-angular';
import { User } from '../../../models/user.model';

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

/** Model for GetProfileQueryResponse object */
export interface GetProfileQueryResponse {
  me: User;
}
