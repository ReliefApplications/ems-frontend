import { gql } from 'apollo-angular';

import { Form } from '../models/form.model';
import { Notification } from '../models/notification.model';
import { Record } from '../models/record.model';
import { User, Role } from '../models/user.model';
import { Page } from '../models/page.model';
import { Application } from '../models/application.model';
import { Channel } from '../models/channel.model';
import { Subscription } from '../models/subscription.model';
import { PositionAttributeCategory } from '../models/position-attribute-category.model';
import { Step } from '../models/step.model';
import { Dashboard } from '../models/dashboard.model';
import { Layout } from '../models/layout.model';

// === EDIT RECORD ===
export const EDIT_RECORD = gql`
  mutation editRecord(
    $id: ID!
    $data: JSON
    $version: ID
    $template: ID
    $display: Boolean
  ) {
    editRecord(id: $id, data: $data, version: $version, template: $template) {
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

export interface EditRecordMutationResponse {
  loading: boolean;
  editRecord: Record;
}

// === EDIT RECORDS ===
export const EDIT_RECORDS = gql`
  mutation editRecords($ids: [ID]!, $data: JSON!, $template: ID) {
    editRecords(ids: $ids, data: $data, template: $template) {
      id
      data
      createdAt
      modifiedAt
    }
  }
`;

export interface EditRecordsMutationResponse {
  loading: boolean;
  editRecords: Record[];
}

// === CONVERT RECORD ===
export const CONVERT_RECORD = gql`
  mutation convertRecord($id: ID!, $form: ID!, $copyRecord: Boolean!) {
    convertRecord(id: $id, form: $form, copyRecord: $copyRecord) {
      id
      createdAt
      modifiedAt
    }
  }
`;

export interface ConvertRecordMutationResponse {
  loading: boolean;
  convertRecord: Record;
}

// === ADD RECORD ===
export const ADD_RECORD = gql`
  mutation addRecord($form: ID!, $data: JSON!, $display: Boolean) {
    addRecord(form: $form, data: $data) {
      id
      createdAt
      modifiedAt
      createdBy {
        name
      }
      data(display: $display)
      form {
        uniqueRecord {
          id
          modifiedAt
          createdBy {
            name
          }
          data
        }
      }
    }
  }
`;

export interface AddRecordMutationResponse {
  loading: boolean;
  addRecord: Record;
}

// === UPLOAD FILE ===
export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!, $form: ID!) {
    uploadFile(file: $file, form: $form)
  }
`;

export interface UploadFileMutationResponse {
  loading: boolean;
  uploadFile: string;
}

// === EDIT USER ===
export const EDIT_USER = gql`
  mutation editUser(
    $id: ID!
    $roles: [ID]!
    $application: ID
    $positionAttributes: [PositionAttributeInputType]
  ) {
    editUser(
      id: $id
      roles: $roles
      application: $application
      positionAttributes: $positionAttributes
    ) {
      id
      username
      name
      roles {
        id
        title
        application {
          id
        }
      }
      positionAttributes {
        value
        category {
          id
          title
        }
      }
      oid
    }
  }
`;

export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}

// === EDIT USER PROFILE ===
export const EDIT_USER_PROFILE = gql`
  mutation editUserProfile($profile: UserProfileInputType!) {
    editUserProfile(profile: $profile) {
      id
      username
      name
      roles {
        id
        title
        application {
          id
        }
      }
      oid
      favoriteApp
    }
  }
`;

export interface EditUserProfileMutationResponse {
  loading: boolean;
  editUserProfile: User;
}

// === ADD PAGE ===
export const ADD_PAGE = gql`
  mutation addPage($type: ContentEnumType!, $content: ID, $application: ID!) {
    addPage(type: $type, content: $content, application: $application) {
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

export interface AddPageMutationResponse {
  loading: boolean;
  addPage: Page;
}

// === ADD ROLE ===
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

export interface AddRoleMutationResponse {
  loading: boolean;
  addRole: Role;
}

export const ADD_ROLE_TO_USERS = gql`
  mutation addRoleToUsers(
    $usernames: [String]!
    $role: ID!
    $positionAttributes: [PositionAttributeInputType]
  ) {
    addRoleToUsers(
      usernames: $usernames
      role: $role
      positionAttributes: $positionAttributes
    ) {
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

export interface AddRoleToUsersMutationResponse {
  loading: boolean;
  addRoleToUsers: User[];
}

export const ADD_USERS = gql`
  mutation addUsers($users: [UserInputType]!, $application: ID) {
    addUsers(users: $users, application: $application) {
      id
      username
      name
      roles {
        id
        title
      }
      positionAttributes {
        value
        category {
          id
          title
        }
      }
      oid
    }
  }
`;

export interface AddUsersMutationResponse {
  loading: boolean;
  addUsers: User[];
}

// === EDIT ROLE ===
export const EDIT_ROLE = gql`
  mutation editRole(
    $id: ID!
    $permissions: [ID]
    $channels: [ID]
    $title: String
  ) {
    editRole(
      id: $id
      permissions: $permissions
      channels: $channels
      title: $title
    ) {
      id
      title
      permissions {
        id
        type
      }
      usersCount
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

export interface EditRoleMutationResponse {
  loading: boolean;
  editRole: Role;
}

// === DELETE ROLE ===
export const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) {
    deleteRole(id: $id) {
      id
    }
  }
`;

export interface DeleteRoleMutationResponse {
  loading: boolean;
  deleteRole: Role;
}

// === DELETE USER ===
export const DELETE_USERS = gql`
  mutation deleteUsers($ids: [ID]!) {
    deleteUsers(ids: $ids)
  }
`;

export interface DeleteUsersMutationResponse {
  loading: boolean;
  deleteUsers: number;
}

// === DELETE USER FROM APPLICATION ===
export const DELETE_USERS_FROM_APPLICATION = gql`
  mutation deleteUsersFromApplication($ids: [ID]!, $application: ID!) {
    deleteUsersFromApplication(ids: $ids, application: $application) {
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

export interface DeleteUsersFromApplicationMutationResponse {
  loading: boolean;
  deleteUsersFromApplication: User[];
}

// === ADD POSITION ===
export const ADD_POSITION_ATTRIBUTE_CATEGORY = gql`
  mutation addPositionAttributeCategory($title: String!, $application: ID!) {
    addPositionAttributeCategory(title: $title, application: $application) {
      id
      title
    }
  }
`;

export interface AddPositionAttributeCategoryMutationResponse {
  loading: boolean;
  addPositionAttributeCategory: PositionAttributeCategory;
}

// === DELETE POSITION ===
export const DELETE_POSITION_ATTRIBUTE_CATEGORY = gql`
  mutation deletePositionAttributeCategory($id: ID!, $application: ID!) {
    deletePositionAttributeCategory(id: $id, application: $application) {
      id
    }
  }
`;

export interface DeletePositionAttributeCategoryMutationResponse {
  loading: boolean;
  deletePositionAttributeCategory: PositionAttributeCategory;
}

// === EDIT POSITION ===
export const EDIT_POSITION_ATTRIBUTE_CATEGORY = gql`
  mutation editPositionAttributeCategory(
    $id: ID!
    $application: ID!
    $title: String!
  ) {
    editPositionAttributeCategory(
      id: $id
      application: $application
      title: $title
    ) {
      id
      title
    }
  }
`;

export interface EditPositionAttributeCategoryMutationResponse {
  loading: boolean;
  editPositionAttributeCategory: PositionAttributeCategory;
}
// === DELETE PAGE ===
export const DELETE_PAGE = gql`
  mutation deletePage($id: ID!) {
    deletePage(id: $id) {
      id
    }
  }
`;

export interface DeletePageMutationResponse {
  loading: boolean;
  deletePage: Page;
}

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
      pages {
        id
        name
        createdAt
        type
        content
        canDelete
        canSee
        canUpdate
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
      locked
      lockedByUser
    }
  }
`;

export interface EditApplicationMutationResponse {
  loading: boolean;
  editApplication: Application;
}

// === SEE NOTIFICATION ===
export const SEE_NOTIFICATION = gql`
  mutation seeNotification($id: ID!) {
    seeNotification(id: $id) {
      id
      action
      content
      createdAt
      channel {
        id
        title
        application {
          id
        }
      }
      seenBy {
        id
        name
      }
    }
  }
`;

export interface SeeNotificationMutationResponse {
  loading: boolean;
  seeNotification: Notification;
}

// === SEE ALL NOTIFICATION ===
export const SEE_NOTIFICATIONS = gql`
  mutation seeNotifications($ids: [ID]!) {
    seeNotifications(ids: $ids)
  }
`;

export interface SeeNotificationsMutationResponse {
  loading: boolean;
  seeNotifications: boolean;
}

// === ADD CHANNEL ===
export const ADD_CHANNEL = gql`
  mutation addChannel($title: String!, $application: ID!) {
    addChannel(title: $title, application: $application) {
      id
      title
      application {
        id
        name
      }
      subscribedRoles {
        id
        title
        usersCount
      }
    }
  }
`;

export interface AddChannelMutationResponse {
  loading: boolean;
  addChannel: Channel;
}

// === EDIT CHANNEL ===
export const EDIT_CHANNEL = gql`
  mutation editChannel($id: ID!, $title: String!) {
    editChannel(id: $id, title: $title) {
      id
      title
    }
  }
`;

export interface EditChannelMutationResponse {
  loading: boolean;
  editChannel: Channel;
}

// === DELETE CHANNEL ===
export const DELETE_CHANNEL = gql`
  mutation deleteChannel($id: ID!) {
    deleteChannel(id: $id) {
      id
      title
    }
  }
`;

export interface DeleteChannelMutationResponse {
  loading: boolean;
  deleteChannel: Channel;
}

// === PUBLISH NOTIFICATION ===
export const PUBLISH_NOTIFICATION = gql`
  mutation publishNotification(
    $action: String!
    $content: JSON!
    $channel: ID!
  ) {
    publishNotification(action: $action, content: $content, channel: $channel) {
      id
      action
      content
      createdAt
      channel {
        id
        title
        application {
          id
          name
        }
      }
      seenBy {
        id
        username
      }
    }
  }
`;

export interface PublishNotificationMutationResponse {
  loading: boolean;
  publishNotification: Notification;
}

// === PUBLISH RECORDS ===
export const PUBLISH = gql`
  mutation publish($ids: [ID]!, $channel: ID!) {
    publish(ids: $ids, channel: $channel)
  }
`;

export interface PublishMutationResponse {
  loading: boolean;
  publish: boolean;
}

// === DELETE RECORD ===
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!) {
    deleteRecord(id: $id) {
      id
    }
  }
`;

export interface DeleteRecordMutationResponse {
  loading: boolean;
  deleteRecord: Record;
}

// === DELETE RECORD ===
export const DELETE_RECORDS = gql`
  mutation deleteRecords($ids: [ID]!) {
    deleteRecords(ids: $ids)
  }
`;

export interface DeleteRecordsMutationResponse {
  loading: boolean;
  deleteRecords: number;
}

// === ADD SUBSCRIPTION ===
export const ADD_SUBSCRIPTION = gql`
  mutation addSubscription(
    $application: ID!
    $routingKey: String!
    $title: String!
    $convertTo: ID
    $channel: ID
  ) {
    addSubscription(
      application: $application
      routingKey: $routingKey
      title: $title
      convertTo: $convertTo
      channel: $channel
    ) {
      routingKey
      title
      convertTo {
        id
        name
      }
      channel {
        id
        title
      }
    }
  }
`;

export interface AddSubscriptionMutationResponse {
  loading: boolean;
  addSubscription: Subscription;
}

// === EDIT SUBSCRIPTION ===
export const EDIT_SUBSCRIPTION = gql`
  mutation editSubscription(
    $applicationId: ID!
    $routingKey: String!
    $title: String!
    $convertTo: String!
    $channel: String!
    $previousSubscription: String!
  ) {
    editSubscription(
      applicationId: $applicationId
      routingKey: $routingKey
      title: $title
      convertTo: $convertTo
      channel: $channel
      previousSubscription: $previousSubscription
    ) {
      routingKey
      title
      convertTo {
        id
        name
      }
      channel {
        id
        title
      }
    }
  }
`;

export interface EditSubscriptionMutationResponse {
  loading: boolean;
  editSubscription: Subscription;
}

// === DELETE SUBSCRIPTION ===
export const DELETE_SUBSCRIPTION = gql`
  mutation deleteSubscription($applicationId: ID!, $routingKey: String!) {
    deleteSubscription(applicationId: $applicationId, routingKey: $routingKey) {
      id
    }
  }
`;

export interface DeleteSubscriptionMutationResponse {
  loading: boolean;
  deleteSubscription: Subscription;
}

// === ADD STEP ===
export const ADD_STEP = gql`
  mutation addStep($type: String!, $content: ID, $workflow: ID!) {
    addStep(type: $type, content: $content, workflow: $workflow) {
      id
      name
      type
      content
      createdAt
    }
  }
`;

export interface AddStepMutationResponse {
  loading: boolean;
  addStep: Step;
}

// === TOGGLE APPLICATION LOCK ===
export const TOGGLE_APPLICATION_LOCK = gql`
  mutation toggleApplicationLock($id: ID!, $lock: Boolean!) {
    toggleApplicationLock(id: $id, lock: $lock) {
      id
      locked
      lockedByUser
    }
  }
`;

export interface ToggleApplicationLockMutationResponse {
  loading: boolean;
  toggleApplicationLock: Application;
}

// === EDIT DASHBOARD ===
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

export interface EditDashboardMutationResponse {
  loading: boolean;
  editDashboard: Dashboard;
}

export const ADD_LAYOUT = gql`
  mutation addLayout($resource: ID, $form: ID, $layout: LayoutInputType!) {
    addLayout(resource: $resource, form: $form, layout: $layout) {
      id
      name
      createdAt
      query
      display
    }
  }
`;

export interface AddLayoutMutationResponse {
  loading: boolean;
  addLayout: Layout;
}

export const EDIT_LAYOUT = gql`
  mutation editLayout(
    $resource: ID
    $form: ID
    $layout: LayoutInputType!
    $id: ID!
  ) {
    editLayout(resource: $resource, form: $form, layout: $layout, id: $id) {
      id
      name
      createdAt
      query
      display
    }
  }
`;

export interface EditLayoutMutationResponse {
  loading: boolean;
  editLayout: Layout;
}

export const DELETE_LAYOUT = gql`
  mutation deleteLayout($resource: ID, $form: ID, $id: ID!) {
    deleteLayout(resource: $resource, form: $form, id: $id) {
      id
      name
      createdAt
    }
  }
`;

export interface deleteLayoutMutationResponse {
  loading: boolean;
  deleteLayout: Layout;
}

// === PAGES ===
/** Duplicate page mutation, used by Application service. */
export const DUPLICATE_PAGE = gql`
  mutation duplicatePage($id: ID!, $application: ID!) {
    duplicatePage(id: $id, application: $application) {
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

/** Interface of duplicate page mutation. */
export interface duplicatePageMutationResponse {
  loading: boolean;
  duplicatePage: Page;
}
