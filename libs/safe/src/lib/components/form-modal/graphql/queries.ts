import { gql } from 'apollo-angular';
import { Form } from '../../../models/form.model';
import { Record } from '../../../models/record.model';

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
      metadata {
        name
        automated
        canSee
        canUpdate
      }
      canUpdate
    }
  }
`;

/** Model for GetFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  form: Form;
}

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
      }
    }
  }
`;

/** Model for GetRecordByIdQueryResponse object */
export interface GetRecordByIdQueryResponse {
  record: Record;
}
