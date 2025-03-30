import { gql } from 'apollo-angular';

/** GraphQL query definition for getting record details for history purpose */
export const GET_RECORD_BY_ID_FOR_HISTORY = gql`
  query GetRecordByIdForHistory($id: ID!) {
    record(id: $id) {
      id
      incrementalId
      form {
        id
        fields
        structure
      }
      resource {
        fields
      }
    }
  }
`;

/** GraphQL query definition to get record history by id */
export const GET_RECORD_HISTORY_BY_ID = gql`
  query GetRecordHistoryByID($id: ID!, $lang: String) {
    recordHistory(id: $id, lang: $lang) {
      createdAt
      createdBy
      incrementalId
      changes {
        type
        field
        displayName
        old
        new
      }
      version {
        id
        createdAt
        data
      }
    }
  }
`;
