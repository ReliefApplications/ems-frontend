import gql from 'graphql-tag';
import { Form } from '../models/form.model';
import { Notification } from '../models/notification.model';
import { Record } from '../models/record.model';
import { User, Role } from '../models/user.model';
import { Page } from '../models/page.model';
import { Application } from '../models/application.model';
import { Channel } from '../models/channel.model';

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
mutation addRoleToUser($username: String!, $role: ID!) {
  addRoleToUser(username: $username, role: $role) {
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
