import { gql } from 'apollo-angular';

// === GET ROLES ===
/** Graphql query for getting roles (of an application or all) */
export const GET_ROLES = gql`
  query GetRoles($all: Boolean, $application: ID) {
    roles(all: $all, application: $application) {
      id
      title
      permissions {
        id
        type
      }
      usersCount
      application {
        name
      }
    }
  }
`;

// === GET USERS ===
/** Graphql query for getting users */
export const GET_USERS = gql`
  {
    users {
      id
      username
      name
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
