import { gql } from 'apollo-angular';

// === DELETE REFERENCE DATA ===
/** Delete ref data gql mutation definition */
export const DELETE_REFERENCE_DATA = gql`
  mutation deleteReferenceData($id: ID!) {
    deleteReferenceData(id: $id) {
      id
    }
  }
`;

// === ADD REFERENCE DATA===
/** Add ref data gql mutation definition */
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
