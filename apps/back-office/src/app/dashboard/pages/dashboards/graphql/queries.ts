import { gql } from 'apollo-angular';

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
