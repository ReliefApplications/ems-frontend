import { gql } from 'apollo-angular';
import { Record, Resource, Form } from '@safe/builder';

// === RESTORE RECORD ===
export const RESTORE_RECORD = gql`
  mutation restoreRecord($id: ID!) {
    restoreRecord(id: $id) {
      id
    }
  }
`;

export interface RestoreRecordMutationResponse {
  loading: boolean;
  restoreRecord: Record;
}

// === EDIT RESOURCE ===
export const EDIT_RESOURCE = gql`
  mutation editResource($id: ID!, $permissions: JSON) {
    editResource(id: $id, permissions: $permissions) {
      id
      name
      createdAt
      fields
      forms {
        id
        name
        status
        createdAt
        recordsCount
        core
        canUpdate
        canDelete
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
    }
  }
`;

export interface EditResourceMutationResponse {
  loading: boolean;
  editResource: Resource;
}

// === DELETE RECORD ===
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!, $hardDelete: Boolean) {
    deleteRecord(id: $id, hardDelete: $hardDelete) {
      id
    }
  }
`;

export interface DeleteRecordMutationResponse {
  loading: boolean;
  deleteRecord: Record;
}

// === DELETE FORM ===
export const DELETE_FORM = gql`
  mutation deleteForm($id: ID!) {
    deleteForm(id: $id) {
      id
    }
  }
`;

export interface DeleteFormMutationResponse {
  loading: boolean;
  deleteForm: Form;
}
