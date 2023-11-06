import { gql } from 'apollo-angular';

// === GET APPLICATIONS ===

/** Graphql request for getting the list of applications */
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
