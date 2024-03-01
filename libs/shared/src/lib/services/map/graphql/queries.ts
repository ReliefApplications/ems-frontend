import { gql } from 'apollo-angular';

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
        referenceDataVariableMapping
        layout
        aggregation
        geoField
        adminField
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
          lightMode
          fontSize
          autoSizeCluster
          drawingInfo {
            renderer {
              type
              symbol {
                color
                size
                fieldForSize
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
              fieldForSize
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
      at
    }
  }
`;

// === GET LAYERS ===
/** Graphql request for getting layers */
export const GET_LAYERS = gql`
  query GetLayers($sortField: String, $filter: JSON) {
    layers(sortField: $sortField, filter: $filter) {
      id
      name
    }
  }
`;
