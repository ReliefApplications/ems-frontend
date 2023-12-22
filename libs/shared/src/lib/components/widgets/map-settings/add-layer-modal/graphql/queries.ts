import { gql } from 'apollo-angular';

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
