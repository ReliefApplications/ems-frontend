import { gql } from 'apollo-angular';

/** Graphql query for converting records of a resource */
export const CONVERT_RESOURCE_RECORDS = gql`
  mutation convertRecords(
    $id: ID!
    $initialType: String!
    $newType: String!
    $field: String!
    $popArray: String
    $failedAction: String!
  ) {
    convertRecords(
      id: $id
      initialType: $initialType
      newType: $newType
      field: $field
      popArray: $popArray
      failedAction: $failedAction
    ) {
      id
      createdAt
      modifiedAt
    }
  }
`;
