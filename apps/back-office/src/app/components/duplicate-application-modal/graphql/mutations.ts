import { gql } from 'apollo-angular';

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
