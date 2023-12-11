import { gql } from 'apollo-angular';

/** GraphQL query definition to get single resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      fields
    }
  }
`;

/** Get ref data gql query definition */
export const GET_REFERENCE_DATA = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
      type
      fields
    }
  }
`;
