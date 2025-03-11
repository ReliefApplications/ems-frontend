import { gql } from 'apollo-angular';

/** Identifier for GraphQl requests */
const GRAPHQL_IDENTIFIER = 'RecordModal';

/** GraphQl form fields for record modal queries */
export const FORM_FIELDS = gql`
  fragment FormFields on Form {
    id
    structure
    metadata {
      name
      automated
      canSee
      canUpdate
    }
  }
`;

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query ${GRAPHQL_IDENTIFIER}_GetRecordById(
    $id: ID!
    $getForm: Boolean!
  ) {
    record(id: $id) {
      id
      data
      createdAt
      modifiedAt
      userCanEdit
      createdBy {
        name
      }
      modifiedBy {
        name
      }
      form @include(if: $getForm) {
        ...FormFields
      }
    }
  }
  ${FORM_FIELDS}
`;

/** Graphql request for getting the form structure by its id */
export const GET_FORM_STRUCTURE = gql`
  query ${GRAPHQL_IDENTIFIER}_GetFormById($id: ID!) {
    form(id: $id) {
      ...FormFields
    }
  }
  ${FORM_FIELDS}
`;
