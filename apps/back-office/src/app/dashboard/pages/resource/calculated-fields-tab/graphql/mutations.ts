import { gql } from 'apollo-angular';

/** Mutation for adding a Calculated fields */
export const Calculated_FIELD_UPDATE = gql`
  mutation UpdateCalculatedFields($resourceId: ID!, $calculatedField: JSON!) {
    editResource(id: $resourceId, calculatedField: $calculatedField) {
      id
      fields
    }
  }
`;
