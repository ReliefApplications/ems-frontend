import { gql } from 'apollo-angular';
import { Record } from '../../../../models/record.model';
import { Layout } from '../../../../models/layout.model';
import { Resource } from '../../../../models/resource.model';

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


// === GET USER ===
export const USER_FIELDS = gql`
  fragment UserFields on User {
    username
  }
`;
/** Graphql request for getting users (optionnally by a list of application ids) */
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`;

