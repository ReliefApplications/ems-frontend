import { gql } from 'apollo-angular';
import { Layer } from '../../../models/layer.model';

// === GET LAYER BY ID ===
/** Graphql request for getting layer data by its id */
export const GET_LAYER_BY_ID = gql`
  query GetLayerById($id: ID!) {
    layer(id: $id) {
      id
      name
    }
  }
`;

// === GET LAYERS ===
/** Graphql request for getting layers */
export const GET_LAYERS = gql`
  query GetLayers {
    layers {
      id
      name
    }
  }
`;

/** Model for GetLayerByIdQueryResponse object */
export interface GetLayerByIdQueryResponse {
  layer: Layer;
}

/** Model for GetLayersQueryResponse object */
export interface GetLayersQueryResponse {
  layers: Layer[];
}
