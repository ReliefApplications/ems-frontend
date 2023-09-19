import { Resource } from '@oort-front/shared';
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

/** Interface for the response of the Calculated fields update mutation */
export interface CalculatedFieldUpdateMutationResponse {
  editResource: Resource;
}
