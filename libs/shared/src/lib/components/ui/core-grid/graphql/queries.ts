import { gql } from 'apollo-angular';

/** Get resource by id to get its query name */
export const GET_RESOURCE_QUERY_NAME = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      singleQueryName
    }
  }
`;

// === GET FORM BY ID ===

/** Graphql request for getting form data by its id */
export const GET_FORM_BY_ID = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      name
      createdAt
      structure
      status
      fields
      resource {
        id
      }
      canUpdate
    }
  }
`;
