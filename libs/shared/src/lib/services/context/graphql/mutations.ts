import { gql } from 'apollo-angular';

/** Graphql request for editing an dashboard by its id */
export const EDIT_DASHBOARD_FILTER = gql`
  mutation editDashboard($id: ID!, $filter: DashboardFilterInputType) {
    editDashboard(id: $id, filter: $filter) {
      id
      filter
    }
  }
`;
