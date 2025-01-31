import { gql } from 'apollo-angular';

/** Identifier for GraphQl requests */
const GRAPHQL_IDENTIFIER = 'FormModal';

/** GraphQl form fields for form modal queries */
export const FORM_FIELDS = gql`
  fragment FormFields on Form {
    id
    name
    createdAt
    structure
    status
    fields
    resource {
      id
    }
    metadata {
      name
      automated
      canSee
      canUpdate
    }
    canUpdate
  }
`;

/** Graphql request for getting form data by its id */
export const GET_FORM_BY_ID = gql`
  query ${GRAPHQL_IDENTIFIER}_GetFormById($id: ID!) {
    form(id: $id) {
      ...FormFields
    }
  }
  ${FORM_FIELDS}
`;

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query ${GRAPHQL_IDENTIFIER}_GetRecordById(
    $id: ID!
    $getForm: Boolean!
  ) {
    record(id: $id) {
      id
      incrementalId
      data
      createdAt
      modifiedAt
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

/** GraphQL mutation to add a new comment */
export const GET_COMMENTS = gql`
  query GetComments($record: ID!) {
    comments(record: $record) {
      id
      questionId
      message
      resolved
      createdAt
      createdBy {
        name
      }
    }
  }
`;
