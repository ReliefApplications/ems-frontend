import { gql } from 'apollo-angular';
import { Application } from '@safe/builder';

// === DUPLICATE APPLICATION ===
/** Duplicate application gql mutation definition */
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

/** Duplication application gql mutation response interface */
export interface DuplicateApplicationMutationResponse {
  loading: boolean;
  duplicateApplication: Application;
}
