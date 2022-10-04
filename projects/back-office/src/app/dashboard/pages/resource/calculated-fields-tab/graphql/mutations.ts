import { gql } from 'apollo-angular';
import { Resource } from '../../../../../../../../safe/src/lib/models/resource.model';

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
  loading: boolean;
  editResource: Resource;
}
