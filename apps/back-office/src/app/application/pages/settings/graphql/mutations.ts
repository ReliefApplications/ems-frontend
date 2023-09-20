import { gql } from 'apollo-angular';
import { Application } from '@oort-front/shared';

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

/** Delete application gql mutation response interface */
export interface DeleteApplicationMutationResponse {
  deleteApplication: Application;
}
