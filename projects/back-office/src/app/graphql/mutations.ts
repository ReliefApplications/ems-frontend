import { gql } from 'apollo-angular';

import {
  Dashboard,
  Form,
  Resource,
  Role,
  User,
  Record,
  Application,
  Page,
  Workflow,
  Step,
  ApiConfiguration,
  PullJob,
  ReferenceData,
} from '@safe/builder';

// === EDIT USER ===
/** Edit user mutation */
export const EDIT_USER = gql`
  mutation editUser($id: ID!, $roles: [ID]!, $application: ID) {
    editUser(id: $id, roles: $roles, application: $application) {
      id
      username
      name
      roles {
        id
        title
      }
      oid
    }
  }
`;

/** Edit user mutation response */
export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}

// === ADD ROLE ===
/** Add role mutation */
export const ADD_ROLE = gql`
  mutation addRole($title: String!, $application: ID) {
    addRole(title: $title, application: $application) {
      id
      title
      permissions {
        id
        type
      }
      usersCount
    }
  }
`;

/** Add role mutation response */
export interface AddRoleMutationResponse {
  loading: boolean;
  addRole: Role;
}

// === EDIT ROLE ===
/** edit role mutation */
export const EDIT_ROLE = gql`
  mutation editRole($id: ID!, $permissions: [ID]!) {
    editRole(id: $id, permissions: $permissions) {
      id
      title
      usersCount
    }
  }
`;

/** Edit role mutation response */
export interface EditRoleMutationResponse {
  loading: boolean;
  editRole: Role;
}

// === DELETE ROLE ===
/** Delete role mutation */
export const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) {
    deleteRole(id: $id) {
      id
    }
  }
`;

/** Delete role mutation response */
export interface DeleteRoleMutationResponse {
  loading: boolean;
  deleteRole: Role;
}

// === ADD DASHBOARD ===
/** Add dashboard mutation */
export const ADD_DASHBOARD = gql`
  mutation addDashboard($name: String!) {
    addDashboard(name: $name) {
      id
      name
      structure
      createdAt
    }
  }
`;

/** Add dashboard mutation response */
export interface AddDashboardMutationResponse {
  loading: boolean;
  addDashboard: Dashboard;
}

// === DELETE DASHBOARD ===
/** Delete dashboard mutation */
export const DELETE_DASHBOARD = gql`
  mutation deleteDashboard($id: ID!) {
    deleteDashboard(id: $id) {
      id
      name
    }
  }
`;

/** Delete dashboard mutation response */
export interface DeleteDashboardMutationResponse {
  loading: boolean;
  deleteDashboard: Dashboard;
}

// === ADD FORM ===
/** Add form mutation */
export const ADD_FORM = gql`
  mutation addForm($name: String!, $resource: ID, $template: ID) {
    addForm(name: $name, resource: $resource, template: $template) {
      id
      name
      createdAt
      status
      versions {
        id
      }
    }
  }
`;

/** Add form mutation response */
export interface AddFormMutationResponse {
  loading: boolean;
  addForm: Form;
}

// === DELETE FORM ===
/** Delete form mutation */
export const DELETE_FORM = gql`
  mutation deleteForm($id: ID!) {
    deleteForm(id: $id) {
      id
    }
  }
`;

/** Delete form mutation response */
export interface DeleteFormMutationResponse {
  loading: boolean;
  deleteForm: Form;
}

// === EDIT RESOURCE ===
/** Edit resource mutation */
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

/** Edit resource mutation response */
export interface EditResourceMutationResponse {
  loading: boolean;
  editResource: Resource;
}

// == DELETE RESOURCE ==
/** Delete resource mutation */
export const DELETE_RESOURCE = gql`
  mutation deleteResource($id: ID!) {
    deleteResource(id: $id) {
      id
    }
  }
`;

/** Delete resource mutation response */
export interface DeleteResourceMutationResponse {
  loading: boolean;
  deletedResource: Resource;
}

// === DELETE RECORD ===
/** Delete record mutation */
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!, $hardDelete: Boolean) {
    deleteRecord(id: $id, hardDelete: $hardDelete) {
      id
    }
  }
`;

/** Delete record mutation response */
export interface DeleteRecordMutationResponse {
  loading: boolean;
  deleteRecord: Record;
}

// === RESTORE RECORD ===
/** Restore record mutation */
export const RESTORE_RECORD = gql`
  mutation restoreRecord($id: ID!) {
    restoreRecord(id: $id) {
      id
    }
  }
`;

/** Restore record mutation response */
export interface RestoreRecordMutationResponse {
  loading: boolean;
  restoreRecord: Record;
}

// === EDIT FORM ===
/** Edit form structure mutation */
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

/** Edit form status mutation */
export const EDIT_FORM_STATUS = gql`
  mutation editForm($id: ID!, $status: Status!) {
    editForm(id: $id, status: $status) {
      status
    }
  }
`;

/** Edit form name mutation */
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

/** Edit form permissions mutation */
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

/** Edit form mutation response */
export interface EditFormMutationResponse {
  loading: boolean;
  editForm: Form;
}

// === EDIT DASHBOARD ===
/** Edit dashboard mutation */
export const EDIT_DASHBOARD = gql`
  mutation editDashboard($id: ID!, $structure: JSON, $name: String) {
    editDashboard(id: $id, structure: $structure, name: $name) {
      id
      name
      structure
      modifiedAt
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
      canSee
      canUpdate
      page {
        id
        name
        application {
          id
        }
      }
    }
  }
`;

/** Edit dashboard mutation response */
export interface EditDashboardMutationResponse {
  loading: boolean;
  editDashboard: Dashboard;
}

// === DELETE APPLICATION ===
/** Delete application mutation */
export const DELETE_APPLICATION = gql`
  mutation deleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;

/** Delete application mutation response */
export interface DeleteApplicationMutationResponse {
  loading: boolean;
  deleteApplication: Application;
}

// === ADD APPLICATION ===
/** Add application mutation */
export const ADD_APPLICATION = gql`
  mutation addApplication {
    addApplication {
      id
      name
      pages {
        id
        name
        createdAt
        type
        content
      }
      createdAt
    }
  }
`;

/** Add application mutation response */
export interface AddApplicationMutationResponse {
  loading: boolean;
  addApplication: Application;
}

// === EDIT APPLICATION ===
/** Edit application mutation */
export const EDIT_APPLICATION = gql`
  mutation editApplication(
    $id: ID!
    $name: String
    $status: Status
    $pages: [ID]
    $permissions: JSON
    $description: String
  ) {
    editApplication(
      id: $id
      name: $name
      status: $status
      pages: $pages
      permissions: $permissions
      description: $description
    ) {
      id
      description
      name
      createdAt
      modifiedAt
      status
      locked
      lockedByUser
      pages {
        id
        name
        createdAt
        type
        content
      }
      settings
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
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Edit application mutation response */
export interface EditApplicationMutationResponse {
  loading: boolean;
  editApplication: Application;
}

// === DUPLICATE APPLICATION ===
/** Duplicate application mutation */
export const DUPLICATE_APPLICATION = gql`
  mutation duplicateApplication($name: String!, $application: ID!) {
    duplicateApplication(name: $name, application: $application) {
      id
      name
      createdAt
      status
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
      canSee
      canUpdate
      canDelete
      usersCount
    }
  }
`;
// in () input parameters, in {} return values
/** Delete application mutation response */
export interface DuplicateApplicationMutationResponse {
  loading: boolean;
  duplicateApplication: Application;
}

// === DELETE PAGE ===
/** Delete page mutation */
export const DELETE_PAGE = gql`
  mutation deletePage($id: ID!) {
    deletePage(id: $id) {
      id
    }
  }
`;

/** Delete page mutation response */
export interface DeletePageMutationResponse {
  loading: boolean;
  deletePage: Page;
}

// === ADD PAGE ===
/** Add page mutation */
export const ADD_PAGE = gql`
  mutation addPage(
    $name: String
    $type: ContentEnumType!
    $content: ID
    $application: ID!
  ) {
    addPage(
      name: $name
      type: $type
      content: $content
      application: $application
    ) {
      id
      name
      type
      content
      createdAt
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Add page mutation response */
export interface AddPageMutationResponse {
  loading: boolean;
  addPage: Page;
}

// === EDIT PAGE ===
/** Edit page mutation */
export const EDIT_PAGE = gql`
  mutation editPage($id: ID!, $name: String, $permissions: JSON) {
    editPage(id: $id, name: $name, permissions: $permissions) {
      id
      name
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
    }
  }
`;

/** Edit page mutation response */
export interface EditPageMutationResponse {
  loading: boolean;
  editPage: Page;
}

// === EDIT WORKFLOW ===
/** Edit workflow mutation */
export const EDIT_WORKFLOW = gql`
  mutation editWorkflow($id: ID!, $name: String, $steps: [ID]) {
    editWorkflow(id: $id, name: $name, steps: $steps) {
      id
      name
    }
  }
`;

/** Edit workflow mutation response */
export interface EditWorkflowMutationResponse {
  loading: boolean;
  editWorkflow: Workflow;
}

// === DELETE STEP ===
/** Delete step mutation */
export const DELETE_STEP = gql`
  mutation deleteStep($id: ID!) {
    deleteStep(id: $id) {
      id
      name
    }
  }
`;

/** Delete step mutation response */
export interface DeleteStepMutationResponse {
  loading: boolean;
  deleteStep: Step;
}

// === EDIT STEP ===
/** Edit step mutation */
export const EDIT_STEP = gql`
  mutation editStep(
    $id: ID!
    $name: String
    $type: String
    $content: ID
    $permissions: JSON
  ) {
    editStep(
      id: $id
      name: $name
      type: $type
      content: $content
      permissions: $permissions
    ) {
      id
      name
      type
      content
      createdAt
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
    }
  }
`;

/** Edit step mutation response */
export interface EditStepMutationResponse {
  loading: boolean;
  editStep: Step;
}

// === EDIT RECORD ===
/** Edit record mutation */
export const EDIT_RECORD = gql`
  mutation editRecord($id: ID!, $data: JSON, $version: ID, $display: Boolean) {
    editRecord(id: $id, data: $data, version: $version) {
      id
      data(display: $display)
      createdAt
      modifiedAt
      createdBy {
        name
      }
    }
  }
`;

/** Edit record mutation response */
export interface EditRecordMutationResponse {
  loading: boolean;
  editRecord: Record;
}

// === ADD API CONFIGURATION ===
/** Add API config mutation */
export const ADD_API_CONFIGURATIION = gql`
  mutation addApiConfiguration($name: String!) {
    addApiConfiguration(name: $name) {
      id
      name
      status
      authType
      endpoint
      graphQLEndpoint
      pingUrl
      settings
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
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Add API configuration mutation response */
export interface AddApiConfigurationMutationResponse {
  loading: boolean;
  addApiConfiguration: ApiConfiguration;
}

// === DELETE API CONFIGURATION ===
/** Delete API configuration mutation */
export const DELETE_API_CONFIGURATION = gql`
  mutation deleteApiConfiguration($id: ID!) {
    deleteApiConfiguration(id: $id) {
      id
    }
  }
`;

/** Delete API configuration mutation response */
export interface DeleteApiConfigurationMutationResponse {
  loading: boolean;
  deleteApiConfiguration: ApiConfiguration;
}

// === EDIT API CONFIGURATION ===
/** Edit API configuration mutation */
export const EDIT_API_CONFIGURATION = gql`
  mutation editApiConfiguration(
    $id: ID!
    $name: String
    $status: Status
    $authType: AuthType
    $endpoint: String
    $graphQLEndpoint: String
    $pingUrl: String
    $settings: JSON
    $permissions: JSON
  ) {
    editApiConfiguration(
      id: $id
      name: $name
      status: $status
      authType: $authType
      endpoint: $endpoint
      graphQLEndpoint: $graphQLEndpoint
      pingUrl: $pingUrl
      settings: $settings
      permissions: $permissions
    ) {
      id
      name
      status
      authType
      endpoint
      graphQLEndpoint
      pingUrl
      settings
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
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Edit API configuration mutation response */
export interface EditApiConfigurationMutationResponse {
  loading: boolean;
  editApiConfiguration: ApiConfiguration;
}

// === ADD PULL JOB ===
/** Add pull job mutation */
export const ADD_PULL_JOB = gql`
  mutation addPullJob(
    $name: String!
    $status: Status!
    $apiConfiguration: ID!
    $url: String
    $path: String
    $schedule: String
    $convertTo: ID
    $mapping: JSON
    $uniqueIdentifiers: [String]
    $channel: ID
  ) {
    addPullJob(
      name: $name
      status: $status
      apiConfiguration: $apiConfiguration
      url: $url
      path: $path
      schedule: $schedule
      convertTo: $convertTo
      mapping: $mapping
      uniqueIdentifiers: $uniqueIdentifiers
      channel: $channel
    ) {
      id
      name
      status
      apiConfiguration {
        id
        name
      }
      schedule
      convertTo {
        id
        name
      }
      mapping
      uniqueIdentifiers
      channel {
        id
        title
      }
    }
  }
`;

/** Add pull job mutation response */
export interface AddPullJobMutationResponse {
  loading: boolean;
  addPullJob: PullJob;
}

// === DELETE PULL JOB ===
/** Delete pull job mutation */
export const DELETE_PULL_JOB = gql`
  mutation deletePullJob($id: ID!) {
    deletePullJob(id: $id) {
      id
    }
  }
`;

/** Delete pull job mutation response */
export interface DeletePullJobMutationResponse {
  loading: boolean;
  deletePullJob: PullJob;
}

// === EDIT PULL JOB ===
/** Edit pull job mutation */
export const EDIT_PULL_JOB = gql`
  mutation editPullJob(
    $id: ID!
    $name: String
    $status: Status
    $apiConfiguration: ID
    $url: String
    $path: String
    $schedule: String
    $convertTo: ID
    $mapping: JSON
    $uniqueIdentifiers: [String]
    $channel: ID
  ) {
    editPullJob(
      id: $id
      name: $name
      status: $status
      apiConfiguration: $apiConfiguration
      url: $url
      path: $path
      schedule: $schedule
      convertTo: $convertTo
      mapping: $mapping
      uniqueIdentifiers: $uniqueIdentifiers
      channel: $channel
    ) {
      id
      name
      status
      apiConfiguration {
        id
        name
      }
      schedule
      convertTo {
        id
        name
      }
      mapping
      uniqueIdentifiers
      channel {
        id
        title
      }
    }
  }
`;

/** Edit pull job mutation response */
export interface EditPullJobMutationResponse {
  loading: boolean;
  editPullJob: PullJob;
}

// === ADD REFERENCE DATA===
/** Add reference data mutation */
export const ADD_REFERENCE_DATA = gql`
  mutation addReferenceData($name: String!) {
    addReferenceData(name: $name) {
      id
      name
      apiConfiguration {
        id
        name
      }
      type
      query
      fields
      valueField
      path
      data
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
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Add reference data mutation response */
export interface AddReferenceDataMutationResponse {
  loading: boolean;
  addReferenceData: ReferenceData;
}

// === DELETE REFERENCE DATA ===
/** Delete reference data mutation */
export const DELETE_REFERENCE_DATA = gql`
  mutation deleteReferenceData($id: ID!) {
    deleteReferenceData(id: $id) {
      id
    }
  }
`;

/** Delete reference data mutation response */
export interface DeleteReferenceDataMutationResponse {
  loading: boolean;
  deleteReferenceData: ReferenceData;
}

// === EDIT REFERENCE DATA ===
/** Edit refenrece data mutation */
export const EDIT_REFERENCE_DATA = gql`
  mutation editReferenceData(
    $id: ID!
    $name: String
    $type: ReferenceDataType
    $apiConfiguration: ID
    $query: String
    $fields: [String]
    $valueField: String
    $path: String
    $data: JSON
    $graphQLFilter: String
    $permissions: JSON
  ) {
    editReferenceData(
      id: $id
      name: $name
      type: $type
      apiConfiguration: $apiConfiguration
      query: $query
      fields: $fields
      valueField: $valueField
      path: $path
      data: $data
      graphQLFilter: $graphQLFilter
      permissions: $permissions
    ) {
      id
      name
      apiConfiguration {
        id
        name
      }
      type
      query
      fields
      valueField
      path
      data
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
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Edit reference data mutation response */
export interface EditReferenceDataMutationResponse {
  loading: boolean;
  editReferenceData: ReferenceData;
}
