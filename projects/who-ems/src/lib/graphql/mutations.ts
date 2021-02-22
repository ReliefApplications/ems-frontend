import gql from 'graphql-tag';
import { Form } from '../models/form.model';
import { Notification } from '../models/notification.model';
import { Record } from '../models/record.model';
import { User, Role } from '../models/user.model';
import { Page } from '../models/page.model';
import { Application } from '../models/application.model';
import { Channel } from '../models/channel.model';
import { Subscription } from '../models/subscription.model';
import { PositionAttributeCategory } from '../models/position-attribute-category.model';

// === EDIT RECORD ===
export const EDIT_RECORD = gql`
mutation editRecord($id: ID!, $data: JSON!, $display: Boolean) {
  editRecord(id: $id, data: $data) {
    id
    data(display: $display)
    createdAt
    modifiedAt
  }
}`;

export interface EditRecordMutationResponse {
  loading: boolean;
  editRecord: Record;
}

// === CONVERT RECORD ===
export const CONVERT_RECORD = gql`
mutation convertRecord($id: ID!, $form: ID!, $copyRecord: Boolean!) {
  convertRecord(id: $id, form: $form, copyRecord: $copyRecord) {
    id
    createdAt
    modifiedAt
  }
}`;

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
    data(display: $display)
  }
}`;

export interface AddRecordMutationResponse {
  loading: boolean;
  addRecord: Record;
}

// === EDIT FORM ===
export const EDIT_FORM_STRUCTURE = gql`
mutation editForm($id: ID!, $structure: JSON!) {
  editForm(id: $id, structure: $structure) {
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
      canCreate {
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
}`;

export interface EditFormMutationResponse {
  loading: boolean;
  editForm: Form;
}

// === EDIT USER ===
export const EDIT_USER = gql`
mutation editUser($id: ID!, $roles: [ID]!, $application: ID) {
  editUser(id: $id, roles: $roles, application: $application) {
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
  }
}`;

export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}

// === ADD PAGE ===
export const ADD_PAGE = gql`
mutation addPage($name: String, $type: String!, $content: ID, $application: ID!) {
  addPage(name: $name, type: $type, content: $content, application: $application){
    id
    name
    type
    content
    createdAt
    canSee
    canUpdate
    canDelete
  }
}`;

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
}`;

export interface AddRoleMutationResponse {
  loading: boolean;
  addRole: Role;
}

export const ADD_ROLE_TO_USER = gql`
mutation addRoleToUser($username: String!, $role: ID!, $positionAttributes: [PositionAttributeInputType]) {
  addRoleToUser(username: $username, role: $role, positionAttributes: $positionAttributes) {
    id
    username
    name
    roles {
      id
      title
    }
    oid
  }
}`;

export interface AddRoleToUserMutationResponse {
  loading: boolean;
  addRoleToUser: User;
}

// === EDIT ROLE ===
export const EDIT_ROLE = gql`
mutation editRole($id: ID!, $permissions: [ID], $channels: [ID]) {
  editRole(id: $id, permissions: $permissions, channels: $channels) {
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
}`;

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
}`;

export interface DeleteRoleMutationResponse {
  loading: boolean;
  deleteRole: Role;
}

// === ADD POSITION ===
export const ADD_POSITION_ATTRIBUTE_CATEGORY = gql`
mutation addPositionAttributeCategory($title: String!, $application: ID!) {
  addPositionAttributeCategory(title: $title, application: $application) {
    id
    title
  }
}`;

export interface AddPositionAttributeCategoryMutationResponse {
  loading: boolean;
  addPositionAttributeCategory: PositionAttributeCategory;
}

// === DELETE PAGE ===
export const DELETE_PAGE = gql`
mutation deletePage($id: ID!) {
  deletePage(id: $id){
    id
  }
}`;

export interface DeletePageMutationResponse {
  loading: boolean;
  deletePage: Page;
}

export const EDIT_APPLICATION = gql`
mutation editApplication($id: ID!, $name: String, $status: String, $pages: [ID], $permissions: JSON, $description: String) {
  editApplication(id: $id, name: $name, status: $status, pages: $pages, permissions: $permissions, description: $description) {
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
}`;

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
}`;

export interface SeeNotificationMutationResponse {
  loading: boolean;
  seeNotification: Notification;
}

// === SEE ALL NOTIFICATION ===
export const SEE_NOTIFICATIONS = gql`
mutation seeNotifications($ids: [ID]!) {
  seeNotifications(ids: $ids)
}`;

export interface SeeNotificationsMutationResponse {
  loading: boolean;
  seeNotifications: boolean;
}

// === ADD CHANNEL ===
export const ADD_CHANNEL = gql`
mutation addChannel($title: String!, $application: ID) {
  addChannel(title: $title, application: $application){
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
}`;

export interface AddChannelMutationResponse {
  loading: boolean;
  addChannel: Channel;
}

// === DELETE CHANNEL ===
export const DELETE_CHANNEL = gql`
mutation deleteChannel($id: ID!) {
  deleteChannel(id: $id){
    id
    title
  }
}`;

export interface DeleteChannelMutationResponse {
  loading: boolean;
  deleteChannel: Channel;
}

// === PUBLISH NOTIFICATION ===
export const PUBLISH_NOTIFICATION = gql`
mutation publishNotification($action: String!, $content: JSON!, $channel: ID!) {
  publishNotification(action: $action, content: $content, channel: $channel){
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
}`;

export interface PublishNotificationMutationResponse {
  loading: boolean;
  publishNotification: Notification;
}

// === PUBLISH RECORDS ===
export const PUBLISH = gql`
mutation publish($ids: [ID]!, $channel: ID!) {
  publish(ids: $ids, channel: $channel)
}`;

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
}`;

export interface DeleteRecordMutationResponse {
  loading: boolean;
  deleteRecord: Record;
}

// === ADD SUBSCRIPTION ===
export const ADD_SUBSCRIPTION = gql`
mutation addSubscription($application: ID!, $routingKey: String!, $title: String!, $convertTo: ID, $channel: ID) {
  addSubscription(application: $application, routingKey: $routingKey, title: $title, convertTo: $convertTo, channel: $channel) {
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
}`;

export interface AddSubscriptionMutationResponse {
  loading: boolean;
  addSubscription: Subscription;
}

// === EDIT SUBSCRIPTION ===
export const EDIT_SUBSCRIPTION = gql`
mutation editSubscription($applicationId: ID!, $routingKey: String!, $title: String!, $convertTo: String!, $channel: String!,  $previousSubscription: String!, ) {
  editSubscription(applicationId: $applicationId, routingKey: $routingKey, title: $title, convertTo: $convertTo, channel: $channel, previousSubscription: $previousSubscription) {
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
}`;

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
}`;

export interface DeleteSubscriptionMutationResponse {
  loading: boolean;
  deleteSubscription: Subscription;
}
