import { gql } from 'apollo-angular';
import { Application } from '@safe/builder';

// === DELETE APPLICATION ===
export const DELETE_APPLICATION = gql`
  mutation deleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;

export interface DeleteApplicationMutationResponse {
  loading: boolean;
  deleteApplication: Application;
}
