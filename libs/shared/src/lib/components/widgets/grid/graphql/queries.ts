import { gql } from 'apollo-angular';

// === GET RECORD BY ID ===
/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      data
      createdAt
      modifiedAt
      createdBy {
        name
      }
      modifiedBy {
        name
      }
      form {
        id
        structure
        permissions {
          recordsUnicity
        }
      }
    }
  }
`;

// === GET RECORD DETAILS ===
/** Graphql request for getting record details by its id */
export const GET_RECORD_DETAILS = gql`
  query GetRecordDetails($id: ID!) {
    record(id: $id) {
      id
      data
      createdAt
      modifiedAt
      createdBy {
        name
      }
      form {
        id
        name
        createdAt
        structure
        fields
        core
        resource {
          id
          name
          forms {
            id
            name
            structure
            fields
            core
          }
        }
      }
      versions {
        id
        createdAt
        data
        createdBy {
          name
        }
      }
    }
  }
`;

// === GET FORM ===
/** Graphql query for getting a form by its id */
export const GET_FORM_BY_ID = gql`
  query GetFormById($id: ID!) {
    form(id: $id) {
      id
      name
      fields
    }
  }
`;

/** Graphql request for getting the user permissions on a resource */
export const GET_USER_ROLES_PERMISSIONS = gql`
  query GetUserRolesPermissions($resource: ID!) {
    resource(id: $resource) {
      canCreateRecords
    }
  }
`;
