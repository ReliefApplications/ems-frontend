import { gql } from 'apollo-angular';
import { LayerModel } from '../../../models/layer.model';

// === GET LAYER BY ID ===
/** Graphql request for getting layer data by its id */
export const GET_LAYER_BY_ID = gql`
  query GetLayerById($id: ID!) {
    layer(id: $id) {
      id
      name
      visibility
      opacity
      datasource {
        resource
        refData
        layout
        aggregation
        geoField
        latitudeField
        longitudeField
      }
      layerDefinition {
        minZoom
        maxZoom
        featureReduction {
          type
          clusterRadius
          drawingInfo {
            renderer {
              type
              symbol {
                color
                size
                style
              }
            }
          }
        }
        drawingInfo {
          renderer {
            type
            symbol {
              color
              size
              style
            }
            blur
            radius
            gradient
            minOpacity
          }
        }
      }
      popupInfo {
        title
        description
        popupElements {
          type
          title
          description
          fields
        }
      }
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
  layer: LayerModel;
}

/** Model for GetLayersQueryResponse object */
export interface GetLayersQueryResponse {
  layers: LayerModel[];
}
