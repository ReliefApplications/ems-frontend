import { gql } from 'apollo-angular';

// === GET ROLES ===

/** Graphql request for getting roles (optionally by an application id) */
export const GET_ROLES = gql`
  query GetRoles($application: ID) {
    roles(application: $application) {
      id
      title
      users {
        totalCount
      }
    }
  }
`;

/** Graphql request for getting groups */
export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      id
      title
      usersCount
    }
  }
`;
