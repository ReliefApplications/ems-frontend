import { gql } from 'apollo-angular';
import { Record } from '../../../../models/record.model';
import { Layout } from '../../../../models/layout.model';

// === GET RECORD BY ID ===
/** Graphql request for getting a record by its id */
export const GET_RECORD_BY_ID = gql`
  query GetRecordById($id: ID!) {
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
      data
      form {
        id
        name
        structure
      }
    }
  }
`;

/** Model for GetRecordByIdQueryResponse object */
export interface GetRecordByIdQueryResponse {
  loading: boolean;
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
  loading: boolean;
  resource: {
    layouts: {
      id: Layout['id'];
      query: Layout['query'];
    }[];
  };
}
