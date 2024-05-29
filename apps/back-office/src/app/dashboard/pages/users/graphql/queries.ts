import { gql } from 'apollo-angular';

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

/** Graphql query for getting users */
export const GET_USERS = gql`
  query GetUsers($first: Int, $afterCursor: ID, $filter: JSON) {
    users(first: $first, afterCursor: $afterCursor, filter: $filter) {
      edges {
        node {
          id
          username
          name
          roles {
            id
            title
          }
          oid
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
