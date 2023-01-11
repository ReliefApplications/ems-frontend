import { gql } from 'apollo-angular';
import { Application } from '../../../models/application.model';

/** GraphQL query to get next page of users from application */
export const GET_APPLICATION_USERS = gql`
  query GetApplicationUsers($id: ID!, $afterCursor: ID, $first: Int) {
    application(id: $id) {
      id
      users(afterCursor: $afterCursor, first: $first) {
        edges {
          node {
            id
            username
            name
            roles {
              id
              title
            }
            oid
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

/** GraphQL query to get next page of automatic assigned users from application */
export const GET_APPLICATION_AUTO_USERS = gql`
  query GetApplicationAutoUsers($id: ID!, $afterCursor: ID, $first: Int) {
    application(id: $id) {
      id
      autoAssignedUsers(afterCursor: $afterCursor, first: $first) {
        edges {
          node {
            id
            username
            name
            roles {
              id
              title
            }
            oid
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

/** Model for the response of the GetApplicationUser and GetApplicationAutoUser queries */
export interface GetApplicationUserQueryResponse {
  loading: boolean;
  application: Pick<Application, 'users' | 'autoAssignedUsers' | 'id'>;
}
