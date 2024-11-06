import { gql } from 'apollo-angular';

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      data
    }
  }
`;

/** Get ref data fields gql query definition */
export const GET_REFERENCE_DATA_FIELDS = gql`
  query GetReferenceData($id: ID!) {
    referenceData(id: $id) {
      id
      name
      fields
    }
  }
`;
