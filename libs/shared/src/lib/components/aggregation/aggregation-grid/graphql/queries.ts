import { gql } from 'apollo-angular';

/** Get resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
    }
  }
`;

/** Get reference data */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
    }
  }
`;
