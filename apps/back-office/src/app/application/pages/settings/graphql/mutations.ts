import { gql } from 'apollo-angular';

// === DELETE APPLICATION ===
/** Delete application gql mutation definition */
export const DELETE_APPLICATION = gql`
  mutation deleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;
