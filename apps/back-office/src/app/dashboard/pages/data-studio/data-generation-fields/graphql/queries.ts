import { gql } from 'apollo-angular';

// === GET RECORD BY ID ===
/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      incrementalId
      createdAt
      modifiedAt
      createdBy {
        name
      }
      modifiedBy {
        name
      }
      data
      form {
        id
        name
        queryName
        structure
        fields
        metadata {
          name
          automated
          canSee
          canUpdate
        }
      }
    }
  }
`;

// === GET FORM STRUCTURE ===

/** Graphql request for getting the structure of a form by its id */
export const GET_FORM_STRUCTURE = gql`
  query GetFormStructure($id: ID!) {
    form(id: $id) {
      id
      name
      structure
      fields
      metadata {
        name
        automated
        canSee
        canUpdate
      }
      resource {
        id
        name
      }
    }
  }
`;
