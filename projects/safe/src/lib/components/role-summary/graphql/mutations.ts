import { gql } from 'apollo-angular';
import { Page } from '../../../models/page.model';
import { Step } from '../../../models/step.model';
import { Role } from '../../../models/user.model';
import { Form } from '../../../models/form.model';

/** Edit role mutation of role summary component */
export const EDIT_ROLE = gql`
  mutation editRole(
    $id: ID!
    $permissions: [ID]
    $channels: [ID]
    $title: String
    $description: String
  ) {
    editRole(
      id: $id
      permissions: $permissions
      channels: $channels
      title: $title
      description: $description
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
    }
  }
`;

/** Interface of edit role mutation response */
export interface EditRoleMutationResponse {
  loading: boolean;
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

/** Edit Form access mutation */
export const EDIT_FORM_ACCESS = gql`
  mutation editForm($id: ID!, $permissions: JSON) {
    editForm(id: $id, permissions: $permissions) {
      id
      name
      permissions {
        canCreateRecords {
          id
        }
        canSeeRecords
        canUpdateRecords
        canDeleteRecords
      }
    }
  }
`;

/** Interface of Edit Form Access mutation response */
export interface EditFormAccessMutationResponse {
  editForm: Form;
}

/** Edit Role rules mutation */
export const EDIT_ROLE_RULES = gql`
  mutation editRole($id: ID!, $rules: JSON) {
    editRole(id: $id, rules: $rules) {
      id
      rules
    }
  }
`;

/** Interface of Edit Role Rules mutation response */
export interface EditRoleRulesMutationResponse {
  editRole: Role;
}
