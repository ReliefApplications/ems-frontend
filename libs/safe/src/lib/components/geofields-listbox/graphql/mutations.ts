import { gql } from 'apollo-angular';
import { Geofield } from '@oort-front/safe';

// === ADD GEOFIELD ===

/** Graphql request for adding a new geofield*/
export const ADD_GEOFIELD = gql`
  mutation addGeofield(
    $id: ID!
    $value: String
    $label: String 
  ) {
    addGeoField(
      id: $id
      value: $value
      label: $label
    ) {
      id
      value
      label
    }
  }
`;

/** Model for AddGeofieldlMutationResponse object */
export interface AddGeofieldMutationResponse {
  addGeofield: Geofield;
}

// === EDIT GEOFIELD ===
/** Edit geoField gql mutation definition */
export const EDIT_GEOFIELD = gql`
  mutation editGeoField(
    $id: ID!
    $value: String
    $label: String 
  ) {
    editGeoField(
      id: $id
      value: $value
      label: $label
    ) {
      id
      value
      label
    }
  }
`;

/** Edit pull job gql mutation response interface */
export interface EditGeoFieldMutationResponse {
  editGeoField: Geofield;
}