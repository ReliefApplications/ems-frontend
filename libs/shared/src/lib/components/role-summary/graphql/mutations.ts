import { gql } from 'apollo-angular';
import { SHORT_RESOURCE_FIELDS } from './fragments';

/** Edit role mutation of role summary component */
export const EDIT_ROLE = gql`
  mutation editRole(
    $id: ID!
    $permissions: [ID]
    $channels: [ID]
    $title: String
    $description: String
    $autoAssignment: JSON
  ) {
    editRole(
      id: $id
      permissions: $permissions
      channels: $channels
      title: $title
      description: $description
      autoAssignment: $autoAssignment
    ) {
      id
      title
      description
      application {
        id
      }
      permissions {
        id
        type
      }
      channels {
        id
        title
        application {
          id
          name
        }
      }
      autoAssignment
    }
  }
`;

/** Edit Page Access mutation */
export const EDIT_PAGE_ACCESS = gql`
  mutation editPage($id: ID!, $permissions: JSON) {
    editPage(id: $id, permissions: $permissions) {
      id
      name
      type
      content
      permissions {
        canSee {
          id
        }
      }
    }
  }
`;

/** Edit Step Access mutation */
export const EDIT_STEP_ACCESS = gql`
  mutation editStep($id: ID!, $permissions: JSON) {
    editStep(id: $id, permissions: $permissions) {
      id
      name
      type
      content
      permissions {
        canSee {
          id
        }
      }
    }
  }
`;

/** Edit Resource access mutation */
export const EDIT_RESOURCE_ACCESS = gql`
  mutation editResource($id: ID!, $permissions: JSON, $role: ID!) {
    editResource(id: $id, permissions: $permissions) {
      ...ShortResourceFields
    }
  }
  ${SHORT_RESOURCE_FIELDS}
`;

/** Edits the permissions for a resource field */
export const EDIT_RESOURCE_FIELD_PERMISSION = gql`
  mutation editResourceFields($id: ID!, $fieldsPermissions: JSON, $role: ID!) {
    editResource(id: $id, fieldsPermissions: $fieldsPermissions) {
      ...ShortResourceFields
    }
  }
  ${SHORT_RESOURCE_FIELDS}
`;

/** Edit Role auto assignment mutation */
export const EDIT_ROLE_AUTO_ASSIGNMENT = gql`
  mutation editRole($id: ID!, $autoAssignment: JSON) {
    editRole(id: $id, autoAssignment: $autoAssignment) {
      id
      autoAssignment
    }
  }
`;
