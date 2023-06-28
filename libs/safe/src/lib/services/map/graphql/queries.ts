import { gql } from 'apollo-angular';
import { LayerModel } from '../../../models/layer.model';

// === GET LAYER BY ID ===
/** Graphql request for getting layer data by its id */
export const GET_LAYER_BY_ID = gql`
  query GetLayerById($id: ID!) {
    layer(id: $id) {
      id
      name
      type
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
            field1
            defaultLabel
            defaultSymbol {
              color
              size
              style
            }
            uniqueValueInfos {
              label
              value
              symbol {
                color
                size
                style
              }
            }
          }
        }
      }
      popupInfo {
        title
        description
        popupElements {
          text
          type
          title
          description
          fields
        }
      }
      sublayers
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
