import { gql } from 'apollo-angular';

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
