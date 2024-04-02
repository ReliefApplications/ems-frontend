import { gql } from 'apollo-angular';

/** Graphql request for getting a record by its unique field value */
export const GET_RECORD_BY_UNIQUE_FIELD_VALUE = gql`
  query GetRecordById($uniqueField: String, $uniqueValue: String) {
    record(uniqueField: $uniqueField, uniqueValue: $uniqueValue) {
      id
      form {
        id
        metadata {
          name
          canUpdate
        }
      }
    }
  }
`;
