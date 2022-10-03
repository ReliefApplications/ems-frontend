import { gql } from 'apollo-angular';
import { Resource } from '../../../../../../../../safe/src/lib/models/resource.model';

/** Mutation for adding a derived fields */
export const DERIVED_FIELD_UPDATE = gql`
  mutation UpdateDerivedFields($resourceId: ID!, $derivedField: JSON!) {
    editResource(id: $resourceId, derivedField: $derivedField) {
      id
      fields
    }
  }
`;

/** Interface for the response of the derived fields update mutation */
export interface DerivedFieldUpdateMutationResponse {
  loading: boolean;
  editResource: Resource;
}
