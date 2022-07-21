import { gql } from 'apollo-angular';
import { ReferenceData } from '@safe/builder';

// === DELETE REFERENCE DATA ===
export const DELETE_REFERENCE_DATA = gql`
  mutation deleteReferenceData($id: ID!) {
    deleteReferenceData(id: $id) {
      id
    }
  }
`;

export interface DeleteReferenceDataMutationResponse {
  loading: boolean;
  deleteReferenceData: ReferenceData;
}

// === ADD REFERENCE DATA===
export const ADD_REFERENCE_DATA = gql`
  mutation addReferenceData($name: String!) {
    addReferenceData(name: $name) {
      id
      name
      apiConfiguration {
        id
        name
      }
      type
      query
      fields
      valueField
      path
      data
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
    }
  }
`;

export interface AddReferenceDataMutationResponse {
  loading: boolean;
  addReferenceData: ReferenceData;
}
