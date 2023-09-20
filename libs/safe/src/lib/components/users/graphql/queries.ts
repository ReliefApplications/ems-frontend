import { gql } from 'apollo-angular';

// === GET USERS ===
/** Graphql request for getting users (optionnally by a list of application ids) */
export const GET_USERS = gql`
  query GetUsers($applications: [ID]) {
    users(applications: $applications) {
      id
      username
      name
      oid
    }
  }
`;
