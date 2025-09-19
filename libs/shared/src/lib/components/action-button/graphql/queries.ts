import { gql } from 'apollo-angular';

/** Get Record By ID query */
export const GET_RECORD_BY_ID = gql`
  query ActionButton_GetRecordById($id: ID!, $includeResource: Boolean!) {
    record(id: $id) {
      id
      data
      resource @include(if: $includeResource) {
        fields
      }
      form {
        id
      }
    }
  }
`;

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_BY_ID = gql`
  query ActionButton_GetResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
    }
  }
`;
