import { gql } from 'apollo-angular';
import { Page } from '@oort-front/shared';

// === GET APPLICATION BY ID ===
/** Graphql request for getting application data by its id */
export const GET_APPLICATION_ARCHIVED_PAGES = gql`
  query GetApplicationById($id: ID!, $asRole: ID, $filter: String) {
    application(id: $id, asRole: $asRole, filter: $filter) {
      id
      pages {
        id
        name
        type
        modifiedAt
        canSee
        canUpdate
        canDelete
      }
    }
  }
`;

/** Model for GetApplicationByIdQueryResponse object */
export interface GetApplicationByIdQueryResponse {
  application: { id: string; pages: Page[] };
}
