import { gql } from 'apollo-angular';
import { Page } from '../../../models/page.model';
import { Role } from '../../../models/user.model';
import { User } from '../../../models/user.model';
import { Channel } from '../../../models/channel.model';
import { Subscription } from '../../../models/subscription.model';
import { PositionAttributeCategory } from '../../../models/position-attribute-category.model';
import { Application } from '../../../models/application.model';
import { Template } from '../../../models/template.model';
import { DistributionList } from '../../../models/distribution-list.model';

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

// === DUPLICATE PAGES ===

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

// === EDIT APPLICATION ===

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

// TEMPLATE OPERATIONS

/** Graphql request for adding a template to an application */
export const ADD_TEMPLATE = gql`
  mutation addTemplate($application: ID!, $template: TemplateInputType!) {
    addTemplate(application: $application, template: $template) {
      id
      name
      type
      content
    }
  }
`;

/** Model for AddTemplateMutationResponse object */
export interface AddTemplateMutationResponse {
  loading: boolean;
  addTemplate: Template;
}

/** Graphql request for editing a template of an application */
export const UPDATE_TEMPLATE = gql`
  mutation editTemplate(
    $application: ID!
    $id: ID!
    $template: TemplateInputType!
  ) {
    editTemplate(application: $application, id: $id, template: $template) {
      id
      name
      type
      content
    }
  }
`;

/** Model for UpdateTemplateMutationResponse object */
export interface UpdateTemplateMutationResponse {
  loading: boolean;
  editTemplate: Template;
}

/** Graphql request for deleting a template of an application */
export const DELETE_TEMPLATE = gql`
  mutation deleteTemplate($application: ID!, $id: ID!) {
    deleteTemplate(application: $application, id: $id) {
      id
      name
      type
      content
    }
  }
`;

/** Model for DeleteTemplateMutationResponse object */
export interface DeleteTemplateMutationResponse {
  loading: boolean;
  deleteTemplate: Template;
}

/** Graphql request for editing a distribution list of an application */
export const UPDATE_DISTRIBUTION_LIST = gql`
  mutation editDistributionList($application: ID!, $id: ID!) {
    editDistributionList(application: $application, id: $id) {
      id
      name
      emails
    }
  }
`;

/** Model for UpdateDistributionListMutationResponse object */
export interface UpdateDistributionListMutationResponse {
  loading: boolean;
  editDistributionList: DistributionList;
}

/** Graphql request for adding a template of an application */
export const ADD_DISTRIBUTION_LIST = gql`
  mutation addDistributionList($application: ID!) {
    addDistributionList(application: $application) {
      id
      name
      emails
    }
  }
`;

/** Model for AddDistributionListMutationResponse object */
export interface AddDistributionListMutationResponse {
  loading: boolean;
  addDistributionList: DistributionList;
}
/** Graphql request for adding a template of an application */
export const DELETE_DISTRIBUTION_LIST = gql`
  mutation deleteDistributionList($application: ID!, $id: ID!) {
    deleteDistributionList(application: $application, id: $id) {
      id
      name
      emails
    }
  }
`;

/** Model for AddDistributionListMutationResponse object */
export interface DeleteDistributionListMutationResponse {
  loading: boolean;
  deleteDistributionList: DistributionList;
}
