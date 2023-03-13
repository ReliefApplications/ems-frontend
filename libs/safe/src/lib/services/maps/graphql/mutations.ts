import { gql } from 'apollo-angular';
import { Layer } from '../../../models/layer.model';

// === ADD Layer ===
/** Graphql request for adding a new layer */
export const ADD_LAYER = gql`
  mutation addLayer($name: String!, $sublayers: [ID]) {
    addLayer(name: $name, sublayers: $sublayers) {
      id
      name
    }
  }
`;

/** Model for AddLayerMutationResponse object */
export interface AddLayerMutationResponse {
  addLayer: Layer;
}

// === DELETE LAYER ===

/** Graphql request for deleting a layer by its id */
export const DELETE_LAYER = gql`
  mutation deleteLayer($id: ID!) {
    deleteLayer(id: $id) {
      id
      name
    }
  }
`;

/** Model for DeleteLayerMutationResponse object */
export interface DeleteLayerMutationResponse {
  deleteLayer: Layer;
}

// === EDIT LAYER ===
/** Edit layer gql mutation definition */
export const EDIT_LAYER = gql`
  mutation editLayer($id: ID!, $parent: ID, $name: String!, $sublayers: [ID]) {
    editLayer(id: $id, parent: $parent, name: $name, sublayers: $sublayers) {
      id
      name
    }
  }
`;

/** Edit layer gql mutation response interface */
export interface EditLayerMutationResponse {
  editLayer: Layer;
}
