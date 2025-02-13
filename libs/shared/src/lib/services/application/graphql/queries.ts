import { gql } from 'apollo-angular';

/** Graphql request for getting application data by its id */
export const GET_APPLICATION_BY_ID = gql`
  query ApplicationService_GetApplicationById(
    $id: ID!
    $shortcut: String!
    $asRole: ID
  ) {
    application(id: $id, shortcut: $shortcut, asRole: $asRole) {
      id
      name
      description
      sideMenu
      hideMenu
      shortcut
      createdAt
      status
      templates {
        id
        name
        type
        content
      }
      distributionLists {
        id
        name
        emails
      }
      pages {
        id
        icon
        showName
        name
        visible
        type
        content
        createdAt
        canSee
        canUpdate
        canDelete
      }
      roles {
        id
        title
        permissions {
          id
          type
        }
        users {
          totalCount
        }
        channels {
          id
          title
          application {
            id
            name
          }
        }
        application {
          id
          name
          shortcut
        }
      }
      userRoles {
        id
        title
        permissions {
          type
        }
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
      channels {
        id
        title
        subscribedRoles {
          id
          title
          application {
            id
            name
          }
          usersCount
        }
      }
      subscriptions {
        routingKey
        title
        channel {
          id
          title
        }
        convertTo {
          id
          name
        }
      }
      canSee
      canUpdate
      canDelete
      positionAttributeCategories {
        id
        title
      }
      locked
      lockedByUser
    }
  }
`;

/** Graphql request for adding a template of an application */
export const DELETE_EMAIL_DISTRIBUTION_LIST = gql`
  mutation DeleteEmailDistributionList($id: ID!) {
    deleteEmailDistributionList(id: $id) {
      name
    }
  }
`;
