import { gql } from 'apollo-angular';

/** Graphql request for editing a record by its id */
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
