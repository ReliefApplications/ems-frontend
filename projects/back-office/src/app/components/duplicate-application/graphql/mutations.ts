import { gql } from 'apollo-angular';
import { Application } from '@safe/builder';

// === DUPLICATE APPLICATION ===
export const DUPLICATE_APPLICATION = gql`
  mutation duplicateApplication($name: String!, $application: ID!) {
    duplicateApplication(name: $name, application: $application) {
      id
      name
      createdAt
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
      usersCount
    }
  }
`;
// in () input parameters, in {} return values

export interface DuplicateApplicationMutationResponse {
  loading: boolean;
  duplicateApplication: Application;
}
