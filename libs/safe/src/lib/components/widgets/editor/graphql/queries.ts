import { gql } from 'apollo-angular';
import { Record } from '../../../../../lib/models/record.model';
import { Page } from '../../../../models/page.model';
import { Application } from '../../../../models/application.model';

/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
    record(id: $id) {
      id
      data
    }
  }
`;

/** Model for GetRecordByIdQueryResponse object */
export interface GetRecordByIdQueryResponse {
  record: Pick<Record, 'id' | 'data'>;
}

/*
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
