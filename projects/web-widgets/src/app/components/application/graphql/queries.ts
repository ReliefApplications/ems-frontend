import gql from 'graphql-tag';
import { Application } from '@safe/builder';

// === GET APPLICATION BY ID ===
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

export interface GetApplicationByIdQueryResponse {
  loading: boolean;
  application: Application;
}
