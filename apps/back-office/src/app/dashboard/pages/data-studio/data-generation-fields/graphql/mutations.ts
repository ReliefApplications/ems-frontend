import { gql } from 'apollo-angular';

/** Graphql query for generating records */
export const GENERATE_RECORDS = gql`
  mutation generateRecords(
    $form: ID!
    $fieldsConfig: [JSON]
    $recordsNumber: Int!
  ) {
    generateRecords(
      form: $form
      fieldsConfig: $fieldsConfig
      recordsNumber: $recordsNumber
    ) {
      id
      createdAt
      modifiedAt
      data
    }
  }
`;

/** Graphql query for editing a record */
export const EDIT_RECORD = gql`
  mutation editRecord(
    $id: ID!
    $data: JSON
    $version: ID
    $template: ID
    $display: Boolean
  ) {
    editRecord(id: $id, data: $data, version: $version, template: $template) {
      id
      data(display: $display)
      createdAt
      modifiedAt
      createdBy {
        name
      }
    }
  }
`;
