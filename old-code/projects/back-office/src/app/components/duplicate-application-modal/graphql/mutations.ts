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
    }
  }
`;

/** Duplication application gql mutation response interface */
export interface DuplicateApplicationMutationResponse {
  duplicateApplication: Application;
}
