import { gql } from 'apollo-angular';
import { LayerModel } from '../../../models/layer.model';

// === ADD Layer ===
/** Graphql request for adding a new layer */
export const ADD_LAYER = gql`
  mutation addLayer($layer: LayerInputType!) {
    addLayer(layer: $layer) {
      id
      name
    }
  }
`;

/** Model for AddLayerMutationResponse object */
export interface AddLayerMutationResponse {
  addLayer: LayerModel;
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
  deleteLayer: LayerModel;
}

// === EDIT LAYER ===
/** Edit layer gql mutation definition */
export const EDIT_LAYER = gql`
  mutation editLayer($id: ID!, $layer: LayerInputType!) {
    editLayer(id: $id, layer: $layer) {
      id
      name
    }
  }
`;

/** Edit layer gql mutation response interface */
export interface EditLayerMutationResponse {
  editLayer: LayerModel;
}
