import { gql } from 'apollo-angular';

// === EDIT FORM ===
/** Edit form structure gql mutation definition */
export const EDIT_FORM_STRUCTURE = gql`
  mutation editForm($id: ID!, $structure: JSON!) {
    editForm(id: $id, structure: $structure) {
      id
      name
      createdAt
      status
      core
      fields
      versions {
        id
        createdAt
        data
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

/** Edit form status gql mutation definition */
export const EDIT_FORM_STATUS = gql`
  mutation editForm($id: ID!, $status: Status!) {
    editForm(id: $id, status: $status) {
      status
    }
  }
`;

/** Edit form permissions gql mutation definition */
export const EDIT_FORM_PERMISSIONS = gql`
  mutation editForm($id: ID!, $permissions: JSON!) {
    editForm(id: $id, permissions: $permissions) {
      id
      name
      createdAt
      status
      versions {
        id
        createdAt
        data
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

/** Edit form name gql mutation definition */
export const EDIT_FORM_NAME = gql`
  mutation editForm($id: ID!, $name: String!) {
    editForm(id: $id, name: $name) {
      id
      name
      createdAt
      status
      versions {
        id
        createdAt
        data
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
