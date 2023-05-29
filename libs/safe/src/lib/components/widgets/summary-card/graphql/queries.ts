import { gql } from 'apollo-angular';
import { Record } from '../../../../models/record.model';
import { Layout } from '../../../../models/layout.model';
import { Resource } from '../../../../models/resource.model';
import { Page } from '../../../../models/page.model';
import { Application } from '../../../../models/application.model';

// === GET RECORD BY ID ===
/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!, $display: Boolean) {
    record(id: $id) {
      id
      incrementalId
      createdAt
      modifiedAt
      createdBy {
        name
      }
      modifiedBy {
        name
      }
      data(display: $display)
      form {
        resource {
          metadata
        }
      }
    }
  }
`;

/** Model for GetRecordByIdQueryResponse object */
export interface GetRecordByIdQueryResponse {
  record: Record;
}

/** Graphql request for getting resource meta date for a grid */
export const GET_RESOURCE_LAYOUTS = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      layouts {
        id
        query
      }
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceLayoutsByIdQueryResponse {
  resource: {
    layouts: {
      id: Layout['id'];
      query: Layout['query'];
    }[];
  };
}

/** Graphql request for getting resource metadata */
export const GET_RESOURCE_METADATA = gql`
  query GetResourceMeta($id: ID!) {
    resource(id: $id) {
      queryName
      metadata {
        name
        type
      }
    }
  }
`;

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceMetadataQueryResponse {
  resource: Resource;
}

/** Graphql request for getting resource layout */
export const GET_LAYOUT = gql`
  query GetLayout($resource: ID!, $id: ID) {
    resource(id: $resource) {
      layouts(ids: [$id]) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
      }
      metadata {
        name
        type
      }
    }
  }
`;

/** Model for GetLayoutQueryResponse object */
export interface GetLayoutQueryResponse {
  resource: Resource;
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
