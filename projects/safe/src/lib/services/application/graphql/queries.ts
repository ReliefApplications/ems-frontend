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

/** Model for GetApplicationByIdQueryResponse object */
export interface GetApplicationByIdQueryResponse {
  loading: boolean;
  application: Application;
}
