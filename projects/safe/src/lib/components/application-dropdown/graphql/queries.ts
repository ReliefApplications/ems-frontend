import { gql } from 'apollo-angular';
import { Application } from '../../../models/application.model';

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

/** Model for GetApplicationsQueryResponse object */
export interface GetApplicationsQueryResponse {
  applications: {
    edges: {
      node: Application;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}
