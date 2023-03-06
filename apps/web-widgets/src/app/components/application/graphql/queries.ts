import gql from 'graphql-tag';
import { Application } from '@oort-front/safe';

// === GET APPLICATION BY ID ===
/** Get application query */
export const GET_APPLICATION_BY_ID = gql`
  query GetApplicationById($id: ID!) {
    application(id: $id) {
      id
      name
      pages {
        id
        name
        type
        content
      }
    }
  }
`;

/** Get application query response */
export interface GetApplicationByIdQueryResponse {
  application: Application;
}
