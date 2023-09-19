import { gql } from 'apollo-angular';
import { Record } from '../../../../models/record.model';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';

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

/** Model for GetRecordByIdQueryResponse object */
export interface GetRecordByIdQueryResponse {
  record: Record;
}

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

/** Model for GetRecordDetailsQueryResponse object */
export interface GetRecordDetailsQueryResponse {
  record: Record;
}

// === GET QUERY TYPES ===
/** Graphql request for getting query types */
export const GET_QUERY_TYPES = gql`
  query GetQueryTypes {
    __schema {
      types {
        name
        kind
        fields {
          name
          args {
            name
            type {
              name
              kind
              inputFields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            fields {
              name
              args {
                name
                type {
                  name
                  kind
                  inputFields {
                    name
                    type {
                      name
                      kind
                    }
                  }
                }
              }
              type {
                name
                kind
                ofType {
                  name
                  fields {
                    name
                    type {
                      name
                      kind
                      ofType {
                        name
                      }
                    }
                  }
                }
              }
            }
            ofType {
              name
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                  }
                }
              }
            }
          }
        }
      }
      queryType {
        name
        kind
        fields {
          name
          args {
            name
            type {
              name
              kind
              inputFields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            ofType {
              name
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                  }
                }
              }
            }
          }
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

/** Interface for getFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  form: Form;
}

/** Graphql request for getting the user permissions on a resource */
export const GET_USER_ROLES_PERMISSIONS = gql`
  query GetUserRolesPermissions($resource: ID!) {
    resource(id: $resource) {
      canCreateRecords
    }
  }
`;

/** Model for GetUserRolePermissionsQueryResponse object */
export interface GetUserRolesPermissionsQueryResponse {
  resource: Resource;
}
