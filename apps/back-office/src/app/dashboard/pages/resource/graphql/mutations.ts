import { gql } from 'apollo-angular';

// === RESTORE RECORD ===
/** Restore record gql mutation definition */
export const RESTORE_RECORD = gql`
  mutation restoreRecord($id: ID!) {
    restoreRecord(id: $id) {
      id
    }
  }
`;

// === EDIT RESOURCE ===
/** Edit resource gql mutation definition */
export const EDIT_RESOURCE = gql`
  mutation editResource(
    $id: ID!
    $permissions: JSON
    $uniquenessRules: [UniquenessRuleInputType]
  ) {
    editResource(
      id: $id
      permissions: $permissions
      uniquenessRules: $uniquenessRules
    ) {
      id
      name
      createdAt
      fields
      uniquenessRules {
        name
        fields
        severity
        message
        condition {
          field
          operator
          value
        }
        dateIntersection {
          startField
          endField
          allowAdjacent
        }
      }
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

// === DELETE RECORD ===
/** Delete record gql mutation definition */
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!, $hardDelete: Boolean) {
    deleteRecord(id: $id, hardDelete: $hardDelete) {
      id
    }
  }
`;
