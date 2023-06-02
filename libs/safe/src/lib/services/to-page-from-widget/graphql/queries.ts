import { Application } from '../../../models/application.model';
import { Page } from '../../../models/page.model';
import { gql } from 'apollo-angular';

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

/**
 * Application page query.
 */
export const GET_PAGE_BY_ID = gql`
  query GetPageById($id: ID!) {
    page(id: $id) {
      id
      name
      createdAt
      modifiedAt
      type
      content
      canSee
    }
  }
`;

/**
 * Interface of application page query.
 */
export interface GetPageByIdQueryResponse {
  /** Application page */
  page: Page;
}
