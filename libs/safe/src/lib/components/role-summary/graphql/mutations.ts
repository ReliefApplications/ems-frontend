import { gql } from 'apollo-angular';
import { Page } from '../../../models/page.model';
import { Step } from '../../../models/step.model';
import { Role } from '../../../models/user.model';
import { Resource } from '../../../models/resource.model';
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

/** Interface of edit role mutation response */
export interface EditRoleMutationResponse {
  editRole: Role;
}

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

/** Interface of Edit Page Access mutation response */
export interface EditPageAccessMutationResponse {
  editPage: Page;
}

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

/** Interface of Edit Step Access mutation response */
export interface EditStepAccessMutationResponse {
  editStep: Step;
}

/** Edit Resource access mutation */
export const EDIT_RESOURCE_ACCESS = gql`
  mutation editResource($id: ID!, $permissions: JSON, $role: ID!) {
    editResource(id: $id, permissions: $permissions) {
      ...ShortResourceFields
    }
  }
  ${SHORT_RESOURCE_FIELDS}
`;

/** Interface of Edit Resource Access mutation response */
export interface EditResourceAccessMutationResponse {
  editResource: Resource;
}

/** Edits the permissions for a resource field */
export const EDIT_RESOURCE_FIELD_PERMISSION = gql`
  mutation editResourceFields($id: ID!, $fieldsPermissions: JSON, $role: ID!) {
    editResource(id: $id, fieldsPermissions: $fieldsPermissions) {
      ...ShortResourceFields
    }
  }
  ${SHORT_RESOURCE_FIELDS}
`;

/** Interface of edit resource field permission mutation response */
export interface EditResourceFieldPermissionMutationResponse {
  editResource: Resource;
}

/** Edits the permissions for a several resource fields */
export const EDIT_RESOURCE_FIELDS_PERMISSIONS = gql`
  mutation editResourceFields($id: ID!, $fieldsPermissions: JSON, $role: ID!) {
    editResource(
      id: $id
      fieldsPermissions: $fieldsPermissions
      multipleFields: true
    ) {
      ...ShortResourceFields
    }
  }
  ${SHORT_RESOURCE_FIELDS}
`;

/** Interface of edit resource field permission mutation response */
export interface EditResourceFieldPermissionMutationResponse {
  editResource: Resource;
}

/** Edit Role auto assignment mutation */
export const EDIT_ROLE_AUTO_ASSIGNMENT = gql`
  mutation editRole($id: ID!, $autoAssignment: JSON) {
    editRole(id: $id, autoAssignment: $autoAssignment) {
      id
      autoAssignment
    }
  }
`;
