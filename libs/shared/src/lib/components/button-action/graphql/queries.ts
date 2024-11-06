import { gql } from 'apollo-angular';

/** Get Record By ID query */
export const GET_RECORD_BY_ID = gql`
  query ButtonAction_GetRecordById($id: ID!) {
    record(id: $id) {
      id
      data
      resource {
        fields
      }
    }
  }
`;

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
    }
  }
`;
