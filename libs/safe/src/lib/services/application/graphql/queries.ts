import { gql } from 'apollo-angular';
import { Application } from '../../../models/application.model';

// === GET APPLICATION BY ID ===
/** Graphql request for getting application data by its id */
export const GET_APPLICATION_BY_ID = gql`
  query GetApplicationById($id: ID!, $asRole: ID) {
    application(id: $id, asRole: $asRole) {
      id
      name
      description
      sideMenu
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
      contextualFilter
      contextualFilterPosition
    }
  }
`;

/** Model for GetApplicationByIdQueryResponse object */
export interface GetApplicationByIdQueryResponse {
  application: Application;
}
