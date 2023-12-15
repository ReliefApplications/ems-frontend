import { gql } from 'apollo-angular';

// === GET APPLICATIONS ===
/** Graphql query for getting multiple applications with a cursor */
export const GET_APPLICATIONS = gql`
  query GetApplications(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $sortField: String
    $sortOrder: String
  ) {
    applications(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      edges {
        node {
          id
          name
          createdAt
          modifiedAt
          status
          permissions {
            canSee {
              id
              title
            }
            canUpdate {
              id
              title
            }
            canDelete {
              id
              title
            }
          }
          canSee
          canUpdate
          canDelete
          users {
            totalCount
          }
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

/**
 * Get Recent applications list
 */
export const GET_RECENT_APPLICATIONS = gql`
  query GetApplications(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $sortField: String
    $sortOrder: String
  ) {
    applications(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      edges {
        node {
          id
          name
          modifiedAt
          status
          canSee
          canUpdate
          canDelete
        }
      }
    }
  }
`;

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
