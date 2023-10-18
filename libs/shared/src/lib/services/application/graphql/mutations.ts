import { gql } from 'apollo-angular';

// === ADD PAGE ===
/** Graphql request for adding a new page of a given type to an application */
export const ADD_PAGE = gql`
  mutation addPage(
    $type: ContentEnumType!
    $content: ID
    $application: ID!
    $structure: JSON
  ) {
    addPage(
      type: $type
      content: $content
      application: $application
      structure: $structure
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

// === DUPLICATE PAGES ===

/** Duplicate page mutation, used by Application service. */
export const DUPLICATE_PAGE = gql`
  mutation duplicatePage($page: ID, $step: ID, $application: ID!) {
    duplicatePage(page: $page, step: $step, application: $application) {
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

// === DELETE PAGE ===

/** Graphql request for deleting a page by its id */
export const DELETE_PAGE = gql`
  mutation deletePage($id: ID!) {
    deletePage(id: $id) {
      id
    }
  }
`;

/** Graphql request for restoring a page by its id */
export const RESTORE_PAGE = gql`
  mutation restorePage($id: ID!) {
    restorePage(id: $id) {
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

// === EDIT PAGE ===
/** Edit page gql mutation definition */
export const EDIT_PAGE = gql`
  mutation editPage(
    $id: ID!
    $name: String
    $icon: String
    $permissions: JSON
    $visible: Boolean
  ) {
    editPage(
      id: $id
      name: $name
      icon: $icon
      permissions: $permissions
      visible: $visible
    ) {
      id
      name
      icon
      visible
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

// === DELETE ROLE ===

/** Graphql request for deleting a role by its id */
export const DELETE_ROLE = gql`
  mutation deleteRole($id: ID!) {
    deleteRole(id: $id) {
      id
    }
  }
`;

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

// === DELETE SUBSCRIPTION ===

/** Grahql request for deleting a subscription from an application */
export const DELETE_SUBSCRIPTION = gql`
  mutation deleteSubscription($applicationId: ID!, $routingKey: String!) {
    deleteSubscription(applicationId: $applicationId, routingKey: $routingKey) {
      id
    }
  }
`;

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

// === DELETE POSITION ===

/** Graphql request for deleting a position attribute category from an application */
export const DELETE_POSITION_ATTRIBUTE_CATEGORY = gql`
  mutation deletePositionAttributeCategory($id: ID!, $application: ID!) {
    deletePositionAttributeCategory(id: $id, application: $application) {
      id
    }
  }
`;

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
    $sideMenu: Boolean
  ) {
    editApplication(
      id: $id
      name: $name
      status: $status
      pages: $pages
      permissions: $permissions
      description: $description
      sideMenu: $sideMenu
    ) {
      id
      description
      sideMenu
      name
      createdAt
      modifiedAt
      status
      pages {
        id
        icon
        name
        visible
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

/** Graphql request for editing a distribution list of an application */
export const UPDATE_DISTRIBUTION_LIST = gql`
  mutation editDistributionList(
    $application: ID!
    $id: ID!
    $distributionList: DistributionListInputType!
  ) {
    editDistributionList(
      application: $application
      id: $id
      distributionList: $distributionList
    ) {
      id
      name
      emails
    }
  }
`;

/** Graphql request for adding a template of an application */
export const ADD_DISTRIBUTION_LIST = gql`
  mutation addDistributionList(
    $application: ID!
    $distributionList: DistributionListInputType!
  ) {
    addDistributionList(
      application: $application
      distributionList: $distributionList
    ) {
      id
      name
      emails
    }
  }
`;

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

/**
 * Add custom notification mutation definition.
 */
export const ADD_CUSTOM_NOTIFICATION = gql`
  mutation AddCustomNotification(
    $application: ID!
    $notification: CustomNotificationInputType!
  ) {
    addCustomNotification(
      application: $application
      notification: $notification
    ) {
      id
      name
      status
      lastExecution
    }
  }
`;

/**
 * Delete custom notification mutation definition.
 */
export const DELETE_CUSTOM_NOTIFICATION = gql`
  mutation DeleteCustomNotification($id: ID!, $application: ID!) {
    deleteCustomNotification(id: $id, application: $application) {
      id
    }
  }
`;
