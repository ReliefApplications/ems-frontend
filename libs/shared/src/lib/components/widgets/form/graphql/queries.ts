import { gql } from 'apollo-angular';

/** Graphql query for getting a form with minimum details by id */
export const GET_SHORT_FORM_BY_ID = gql`
  query GetShortFormById($id: ID!) {
    form(id: $id) {
      id
      name
      core
      structure
      fields
      status
      queryName
      canCreateRecords
      uniqueRecord {
        id
        modifiedAt
        data
      }
      metadata {
        name
        automated
        canSee
        canUpdate
      }
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      canUpdate
      resource {
        id
        name
      }
    }
  }
`;

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
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
      form {
        id
        structure
        fields
        permissions {
          recordsUnicity
        }
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
  }
`;
