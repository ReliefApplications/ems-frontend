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
        type
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
              outline {
                color
                width
              }
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
              outline {
                color
                width
              }
            }
            uniqueValueInfos {
              label
              value
              symbol {
                color
                size
                style
                outline {
                  color
                  width
                }
              }
            }
          }
        }
      }
      popupInfo {
        title
        description
        fieldsInfo {
          type
          name
          label
        }
        popupElements {
          text
          type
          title
          description
          fields
        }
      }
      sublayers
      contextFilters
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
