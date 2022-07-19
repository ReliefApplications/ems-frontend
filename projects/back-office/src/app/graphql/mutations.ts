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
  Layout,
  ReferenceData,
} from '@safe/builder';

/**
 * EDIT_USER mutation
 */
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

/**
 * Model for EDIT_USER mutation
 */
export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}

/**
 * ADD_ROLE mutation
 */
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

/**
 * Model for ADD_ROLE mutation
 */
export interface AddRoleMutationResponse {
  loading: boolean;
  addRole: Role;
}

/**
 * Model for ADD_ROLE mutation
 */
export const EDIT_ROLE = gql`
  mutation editRole($id: ID!, $permissions: [ID]!) {
    editRole(id: $id, permissions: $permissions) {
      id
      title
      usersCount
    }
  }
`;

/**
 * Model for EDIT_ROLE mutation
 */
export interface EditRoleMutationResponse {
  loading: boolean;
  editRole: Role;
}

/**
 * DELETE_ROLE mutation
 */
export const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) {
    deleteRole(id: $id) {
      id
    }
  }
`;

/**
 * Model for DELETE_ROLE mutation
 */
export interface DeleteRoleMutationResponse {
  loading: boolean;
  deleteRole: Role;
}

/**
 * ADD_DASHBOARD mutation
 */
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

/**
 * Model for ADD_DASHBOARD mutation
 */
export interface AddDashboardMutationResponse {
  loading: boolean;
  addDashboard: Dashboard;
}

/**
 * DELETE_DASHBOARD mutation
 */
export const DELETE_DASHBOARD = gql`
  mutation deleteDashboard($id: ID!) {
    deleteDashboard(id: $id) {
      id
      name
    }
  }
`;

/**
 * Model for DELETE_DASHBOARD mutation
 */
export interface DeleteDashboardMutationResponse {
  loading: boolean;
  deleteDashboard: Dashboard;
}

/**
 * ADD_FORM mutation
 */
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

/**
 * Model for ADD_FORM mutation
 */
export interface AddFormMutationResponse {
  loading: boolean;
  addForm: Form;
}

/**
 * DELETE_FORM mutation
 */
export const DELETE_FORM = gql`
  mutation deleteForm($id: ID!) {
    deleteForm(id: $id) {
      id
    }
  }
`;

/**
 * Module for DELETE_FORM mutation
 */
export interface DeleteFormMutationResponse {
  loading: boolean;
  deleteForm: Form;
}

/**
 * EDIT_RESOURCE mutation
 */
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

/**
 * Model for EDIT_RESOURCE mutation
 */
export interface EditResourceMutationResponse {
  loading: boolean;
  editResource: Resource;
}

/**
 * DELETE_RESOURCE mutation
 */
export const DELETE_RESOURCE = gql`
  mutation deleteResource($id: ID!) {
    deleteResource(id: $id) {
      id
    }
  }
`;

/**
 * Model for DELETE_RESOURCE mutation
 */
export interface DeleteResourceMutationResponse {
  loading: boolean;
  deletedResource: Resource;
}

/**
 * DELETE_RECORD mutation
 */
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!, $hardDelete: Boolean) {
    deleteRecord(id: $id, hardDelete: $hardDelete) {
      id
    }
  }
`;

/**
 * Model for DELETE_RECORD mutation
 */
export interface DeleteRecordMutationResponse {
  loading: boolean;
  deleteRecord: Record;
}

/**
 * RESTORE_RECORD mutation
 */
export const RESTORE_RECORD = gql`
  mutation restoreRecord($id: ID!) {
    restoreRecord(id: $id) {
      id
    }
  }
`;

/**
 * Model for RESTORE_RECORD mutation
 */
export interface RestoreRecordMutationResponse {
  loading: boolean;
  restoreRecord: Record;
}

/**
 * EDIT_FORM_STRUCTURE mutation
 */
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

/**
 * EDIT_FORM_STATUS mutation
 */
export const EDIT_FORM_STATUS = gql`
  mutation editForm($id: ID!, $status: Status!) {
    editForm(id: $id, status: $status) {
      status
    }
  }
`;

/**
 * EDIT_FORM_NAME mutation
 */
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

/**
 * EDIT_FORM_PERMISSIONS mutation
 */
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

/**
 * Model for EDIT_FORM mutations
 */
export interface EditFormMutationResponse {
  loading: boolean;
  editForm: Form;
}

/**
 * EDIT_DASHBOARD mutation
 */
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

/**
 * Model for EDIT_DASHBOARD mutation
 */
export interface EditDashboardMutationResponse {
  loading: boolean;
  editDashboard: Dashboard;
}

/**
 * DELETE_APPLICATION mutation
 */
export const DELETE_APPLICATION = gql`
  mutation deleteApplication($id: ID!) {
    deleteApplication(id: $id) {
      id
      name
    }
  }
`;

/**
 * Model for DELETE_APPLICATION mutation
 */
export interface DeleteApplicationMutationResponse {
  loading: boolean;
  deleteApplication: Application;
}

/**
 * ADD_APPLICATION mutation
 */
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

/**
 * Model for ADD_APPLICATION mutation
 */
export interface AddApplicationMutationResponse {
  loading: boolean;
  addApplication: Application;
}

/**
 * EDIT_APPLICATION mutation
 */
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

/**
 * Model for EDIT_APPLICATION mutation
 */
export interface EditApplicationMutationResponse {
  loading: boolean;
  editApplication: Application;
}

/**
 * DUPLICATE_APPLICATION mutation
 */
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

/**
 * Model for DUPLICATE_APPLICATION mutation
 */
export interface DuplicateApplicationMutationResponse {
  loading: boolean;
  duplicateApplication: Application;
}

/**
 * DELETE_PAGE mutation
 */
export const DELETE_PAGE = gql`
  mutation deletePage($id: ID!) {
    deletePage(id: $id) {
      id
    }
  }
`;

/**
 * Model for DELETE_PAGE mutation
 */
export interface DeletePageMutationResponse {
  loading: boolean;
  deletePage: Page;
}

/**
 * ADD_PAGE mutation
 */
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

/**
 * Model for ADD_PAGE mutation
 */
export interface AddPageMutationResponse {
  loading: boolean;
  addPage: Page;
}

/**
 * EDIT_PAGE mutation
 */
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

/**
 * Model for EDIT_PAGE mutation
 */
export interface EditPageMutationResponse {
  loading: boolean;
  editPage: Page;
}

/**
 * EDIT_WORKFLOW mutation
 */
export const EDIT_WORKFLOW = gql`
  mutation editWorkflow($id: ID!, $name: String, $steps: [ID]) {
    editWorkflow(id: $id, name: $name, steps: $steps) {
      id
      name
    }
  }
`;

/**
 * Model for EDIT_WORKFLOW mutation
 */
export interface EditWorkflowMutationResponse {
  loading: boolean;
  editWorkflow: Workflow;
}

/**
 * DELETE_STEP mutation
 */
export const DELETE_STEP = gql`
  mutation deleteStep($id: ID!) {
    deleteStep(id: $id) {
      id
      name
    }
  }
`;

/**
 * Model for DELETE_STEP mutation
 */
export interface DeleteStepMutationResponse {
  loading: boolean;
  deleteStep: Step;
}

/**
 * EDIT_STEP mutation
 */
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

/**
 * Model for EDIT_STEP mutation
 */
export interface EditStepMutationResponse {
  loading: boolean;
  editStep: Step;
}

/**
 * EDIT_RECORD mutation
 */
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

/**
 * Model for EDIT_RECORD mutation
 */
export interface EditRecordMutationResponse {
  loading: boolean;
  editRecord: Record;
}

/**
 * ADD_API_CONFIGURATIION mutation
 */
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

/**
 * Model for ADD_API_CONFIGURATIION mutation
 */
export interface AddApiConfigurationMutationResponse {
  loading: boolean;
  addApiConfiguration: ApiConfiguration;
}

/**
 * DELETE_API_CONFIGURATION mutation
 */
export const DELETE_API_CONFIGURATION = gql`
  mutation deleteApiConfiguration($id: ID!) {
    deleteApiConfiguration(id: $id) {
      id
    }
  }
`;

/**
 * Model for DELETE_API_CONFIGURATION mutation
 */
export interface DeleteApiConfigurationMutationResponse {
  loading: boolean;
  deleteApiConfiguration: ApiConfiguration;
}

/**
 * EDIT_API_CONFIGURATION mutation
 */
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

/**
 * Model for EDIT_API_CONFIGURATION mutation
 */
export interface EditApiConfigurationMutationResponse {
  loading: boolean;
  editApiConfiguration: ApiConfiguration;
}

/**
 * ADD_PULL_JOB mutation
 */
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

/**
 * Model for ADD_PULL_JOB mutation
 */
export interface AddPullJobMutationResponse {
  loading: boolean;
  addPullJob: PullJob;
}

/**
 * DELETE_PULL_JOB mutation
 */
export const DELETE_PULL_JOB = gql`
  mutation deletePullJob($id: ID!) {
    deletePullJob(id: $id) {
      id
    }
  }
`;

/**
 * Model for DELETE_PULL_JOB mutation
 */
export interface DeletePullJobMutationResponse {
  loading: boolean;
  deletePullJob: PullJob;
}

/**
 * EDIT_PULL_JOB mutation
 */
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

/**
 * Model for EDIT_PULL_JOB mutation
 */
export interface EditPullJobMutationResponse {
  loading: boolean;
  editPullJob: PullJob;
}

/**
 * ADD_REFERENCE_DATA mutation
 */
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

/**
 * Model for ADD_REFERENCE_DATA mutation
 */
export interface AddReferenceDataMutationResponse {
  loading: boolean;
  addReferenceData: ReferenceData;
}

/**
 * DELETE_REFERENCE_DATA mutation
 */
export const DELETE_REFERENCE_DATA = gql`
  mutation deleteReferenceData($id: ID!) {
    deleteReferenceData(id: $id) {
      id
    }
  }
`;

/**
 * Model for DELETE_REFERENCE_DATA mutation
 */
export interface DeleteReferenceDataMutationResponse {
  loading: boolean;
  deleteReferenceData: ReferenceData;
}

/**
 * EDIT_REFERENCE_DATA mutation
 */
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

/**
 * Model for EDIT_REFERENCE_DATA mutation
 */
export interface EditReferenceDataMutationResponse {
  loading: boolean;
  editReferenceData: ReferenceData;
}
