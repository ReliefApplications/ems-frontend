import { gql } from 'apollo-angular';
import { Dashboard } from '@oort-front/shared';

// === GET DASHBOARDS ===
/** Graphql request for getting dashboards */
export const GET_DASHBOARDS = gql`
  {
    dashboards {
      id
      name
      createdAt
      structure
      canDelete
    }
  }
`;

/** Model for GetDashboardsQueryResponse object */
export interface GetDashboardsQueryResponse {
  dashboards: Dashboard[];
}
