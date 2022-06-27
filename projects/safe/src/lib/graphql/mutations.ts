import { gql } from 'apollo-angular';
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

/** Graphql request for editing a record by its id */
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

/** Model for EditRecordMutationResponse object */
export interface EditRecordMutationResponse {
  loading: boolean;
  editRecord: Record;
}

// === EDIT RECORDS ===

/** Graphql request for editing multiple records by their ids */
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

/** Model for EditRecordsMutationResponse object */
export interface EditRecordsMutationResponse {
  loading: boolean;
  editRecords: Record[];
}

// === CONVERT RECORD ===

/** Graphql request for converting a record with its id and its form id */
export const CONVERT_RECORD = gql`
  mutation convertRecord($id: ID!, $form: ID!, $copyRecord: Boolean!) {
    convertRecord(id: $id, form: $form, copyRecord: $copyRecord) {
      id
      createdAt
      modifiedAt
    }
  }
`;

/** Model for ConvertRecordMutationResponse object */
export interface ConvertRecordMutationResponse {
  loading: boolean;
  convertRecord: Record;
}

// === ADD RECORD ===

/** Graphql request for adding a new record to a form */
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

/** Model for AddRecordMutationResponse object */
export interface AddRecordMutationResponse {
  loading: boolean;
  addRecord: Record;
}

// === UPLOAD FILE ===

/** Graphql request for uploading a file to a form */
export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!, $form: ID!) {
    uploadFile(file: $file, form: $form)
  }
`;

/** Model for UploadFileMutationResponse object */
export interface UploadFileMutationResponse {
  loading: boolean;
  uploadFile: string;
}

// === EDIT USER ===

/** Graphql request for editing roles of a user by its id */
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

/** Model for EditUserMutationResponse object */
export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}

// === EDIT USER PROFILE ===

/** Graphql request for editing the user profile */
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

/** Model for EditUserProfileMutationResponse object */
export interface EditUserProfileMutationResponse {
  loading: boolean;
  editUserProfile: User;
}

// === ADD PAGE ===

/** Graphql request for adding a new page of a given type to an application */
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

/** Model for AddPageMutationResponse object */
export interface AddPageMutationResponse {
  loading: boolean;
  addPage: Page;
}

// === ADD ROLE ===

/** Graphql request for adding a new role to an application */
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

/** Model for AddRoleMutationResponse object */
export interface AddRoleMutationResponse {
  loading: boolean;
  addRole: Role;
}

/** Graphql request for adding a role to a user */
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

/** Model for AddRoleToUsersMutationResponse object */
export interface AddRoleToUsersMutationResponse {
  loading: boolean;
  addRoleToUsers: User[];
}

/** Graphql request for adding users to an application */
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

/** Model for AddUsersMutationResponse object */
export interface AddUsersMutationResponse {
  loading: boolean;
  addUsers: User[];
}

// === EDIT ROLE ===

/** Graphql request for editing a role by its id */
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

/** Model for EditRoleMutationResponse object */
export interface EditRoleMutationResponse {
  loading: boolean;
  editRole: Role;
}

// === DELETE ROLE ===

/** Graphql request for deleting a role by its id */
export const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) {
    deleteRole(id: $id) {
      id
    }
  }
`;

/** Model for DeleteRoleMutationResponse object */
export interface DeleteRoleMutationResponse {
  loading: boolean;
  deleteRole: Role;
}

// === DELETE USER ===

/** Graphql request for deleting multiple users by their ids */
export const DELETE_USERS = gql`
  mutation deleteUsers($ids: [ID]!) {
    deleteUsers(ids: $ids)
  }
`;

/** Model for DeleteUsersMutationResponse object */
export interface DeleteUsersMutationResponse {
  loading: boolean;
  deleteUsers: number;
}

// === DELETE USER FROM APPLICATION ===

/** Graphql request for removing multiple users from an application  */
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

/** Model for DeleteUsersFromApplicationMutationResponse object */
export interface DeleteUsersFromApplicationMutationResponse {
  loading: boolean;
  deleteUsersFromApplication: User[];
}

// === ADD POSITION ===

/** Graphql request for adding a new position attribute category to an application */
export const ADD_POSITION_ATTRIBUTE_CATEGORY = gql`
  mutation addPositionAttributeCategory($title: String!, $application: ID!) {
    addPositionAttributeCategory(title: $title, application: $application) {
      id
      title
    }
  }
`;

/** Model for AddPositionAttributeCategoryMutationResponse object */
export interface AddPositionAttributeCategoryMutationResponse {
  loading: boolean;
  addPositionAttributeCategory: PositionAttributeCategory;
}

// === DELETE POSITION ===

/** Graphql request for deleting a position attribute category from an application */
export const DELETE_POSITION_ATTRIBUTE_CATEGORY = gql`
  mutation deletePositionAttributeCategory($id: ID!, $application: ID!) {
    deletePositionAttributeCategory(id: $id, application: $application) {
      id
    }
  }
`;

/** Model for DeletePositionAttributeCategoryMutationResponse object */
export interface DeletePositionAttributeCategoryMutationResponse {
  loading: boolean;
  deletePositionAttributeCategory: PositionAttributeCategory;
}

// === EDIT POSITION ===

/** Graphql request for editing position attribute category in an application */
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

/** Model for EditPositionAttributeCategoryMutationResponse object */
export interface EditPositionAttributeCategoryMutationResponse {
  loading: boolean;
  editPositionAttributeCategory: PositionAttributeCategory;
}

// === DELETE PAGE ===

/** Graphql request for deleting a page by its id */
export const DELETE_PAGE = gql`
  mutation deletePage($id: ID!) {
    deletePage(id: $id) {
      id
    }
  }
`;

/** Model for DeletePageMutationResponse object */
export interface DeletePageMutationResponse {
  loading: boolean;
  deletePage: Page;
}

/** Graphql request for editing an application by its id */
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

/** Model for EditApplicationMutationResponse object */
export interface EditApplicationMutationResponse {
  loading: boolean;
  editApplication: Application;
}

// === SEE NOTIFICATION ===

/** Graphql request for marking a notification as seen */
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

/** Model for SeeNotificationMutationResponse object */
export interface SeeNotificationMutationResponse {
  loading: boolean;
  seeNotification: Notification;
}

// === SEE ALL NOTIFICATION ===

/** Graphql request for marking multiple notifications as seen */
export const SEE_NOTIFICATIONS = gql`
  mutation seeNotifications($ids: [ID]!) {
    seeNotifications(ids: $ids)
  }
`;

/** Model for SeeNotificationsMutationResponse object */
export interface SeeNotificationsMutationResponse {
  loading: boolean;
  seeNotifications: boolean;
}

// === ADD CHANNEL ===

/** Graphql request for adding a new channel to an application */
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

/** Model for AddChannelMutationResponse object */
export interface AddChannelMutationResponse {
  loading: boolean;
  addChannel: Channel;
}

// === EDIT CHANNEL ===

/** Graphql request for editing a channel by its id */
export const EDIT_CHANNEL = gql`
  mutation editChannel($id: ID!, $title: String!) {
    editChannel(id: $id, title: $title) {
      id
      title
    }
  }
`;

/** Model for EditChannelMutationResponse object */
export interface EditChannelMutationResponse {
  loading: boolean;
  editChannel: Channel;
}

// === DELETE CHANNEL ===

/** Graphql request for deleting a channel */
export const DELETE_CHANNEL = gql`
  mutation deleteChannel($id: ID!) {
    deleteChannel(id: $id) {
      id
      title
    }
  }
`;

/** Model for DeleteChannelMutationResponse object */
export interface DeleteChannelMutationResponse {
  loading: boolean;
  deleteChannel: Channel;
}

// === PUBLISH NOTIFICATION ===

/** Graphql request for publishing a new notification onto a a channel */
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

/** Model for PublishNotificationMutationResponse object */
export interface PublishNotificationMutationResponse {
  loading: boolean;
  publishNotification: Notification;
}

// === PUBLISH RECORDS ===

/** Graphql request for publishing rows to a channel */
export const PUBLISH = gql`
  mutation publish($ids: [ID]!, $channel: ID!) {
    publish(ids: $ids, channel: $channel)
  }
`;

/** Model for PublishMutationResponse object */
export interface PublishMutationResponse {
  loading: boolean;
  publish: boolean;
}

// === DELETE RECORD ===

/** Graphql request for deleting a record by its id */
export const DELETE_RECORD = gql`
  mutation deleteRecord($id: ID!) {
    deleteRecord(id: $id) {
      id
    }
  }
`;

/** Model for DeleteRecordMutationResponse object */
export interface DeleteRecordMutationResponse {
  loading: boolean;
  deleteRecord: Record;
}

// === DELETE RECORD ===

/** Graphl request for deleting multiple records by their ids */
export const DELETE_RECORDS = gql`
  mutation deleteRecords($ids: [ID]!) {
    deleteRecords(ids: $ids)
  }
`;

/** Model for DeleteRecordsMutationResponse object */
export interface DeleteRecordsMutationResponse {
  loading: boolean;
  deleteRecords: number;
}

// === ADD SUBSCRIPTION ===

/** Graphql request for adding a new subscription to an application */
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

/** Model for AddSubscriptionMutationResponse object */
export interface AddSubscriptionMutationResponse {
  loading: boolean;
  addSubscription: Subscription;
}

// === EDIT SUBSCRIPTION ===

/** Graphql resuest for editing a subscription in an application */
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

/** Model for EditSubscriptionMutationResponse object */
export interface EditSubscriptionMutationResponse {
  loading: boolean;
  editSubscription: Subscription;
}

// === DELETE SUBSCRIPTION ===

/** Grahql request for deleting a subscription from an application */
export const DELETE_SUBSCRIPTION = gql`
  mutation deleteSubscription($applicationId: ID!, $routingKey: String!) {
    deleteSubscription(applicationId: $applicationId, routingKey: $routingKey) {
      id
    }
  }
`;

/** Model for DeleteSubscriptionMutationResponse object */
export interface DeleteSubscriptionMutationResponse {
  loading: boolean;
  deleteSubscription: Subscription;
}

// === ADD STEP ===
/** Graphql request for adding a new step of a given type to a workflow */
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

/** Model for AddStepMutationResponse object */
export interface AddStepMutationResponse {
  loading: boolean;
  addStep: Step;
}

// === TOGGLE APPLICATION LOCK ===

/** Graphql request for toggling the application lock state */
export const TOGGLE_APPLICATION_LOCK = gql`
  mutation toggleApplicationLock($id: ID!, $lock: Boolean!) {
    toggleApplicationLock(id: $id, lock: $lock) {
      id
      locked
      lockedByUser
    }
  }
`;

/** Model for ToggleApplicationLockMutationResponse object */
export interface ToggleApplicationLockMutationResponse {
  loading: boolean;
  toggleApplicationLock: Application;
}

// === EDIT DASHBOARD ===

/** Graphql request for editing a dashboard by its id */
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

/** Model for EditiDashboardMutationResponse object */
export interface EditDashboardMutationResponse {
  loading: boolean;
  editDashboard: Dashboard;
}

/** Graphql request for adding a new layout with a given type */
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

/** Model for AddLayoutMutationResponse object */
export interface AddLayoutMutationResponse {
  loading: boolean;
  addLayout: Layout;
}

/** Grahql request for editing a layout by its id */
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

/** Model for EditLayoutMutationResponse object */
export interface EditLayoutMutationResponse {
  loading: boolean;
  editLayout: Layout;
}

/** Graphql request for deleting a layout by its id */
export const DELETE_LAYOUT = gql`
  mutation deleteLayout($resource: ID, $form: ID, $id: ID!) {
    deleteLayout(resource: $resource, form: $form, id: $id) {
      id
      name
      createdAt
    }
  }
`;

/** Model for deleteLayoutMutationResponse object */
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
