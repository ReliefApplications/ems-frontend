import { gql } from 'apollo-angular';

// === GET DASHBOARDS BY PAGE===
/** Graphql request for getting dashboards */
export const GET_DASHBOARDS_BY_PAGE = gql`
  query GetDashboardsByPage($page: ID!) {
    dashboards(page: $page) {
      id
      name
      createdAt
      structure
      canDelete
    }
  }
`;
