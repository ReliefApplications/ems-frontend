import { gql } from 'apollo-angular';
import { Record } from '../../../models/record.model';

// === GET RECORD DETAILS ===

/** Graphql request for getting record details by its id */
export const GET_RECORD_DETAILS = gql`
  query GetRecordDetails($id: ID!) {
    record(id: $id) {
      id
      data
      createdAt
      modifiedAt
      createdBy {
        name
      }
      form {
        id
        name
        createdAt
        structure
        fields
        core
        resource {
          id
          name
          forms {
            id
            name
            structure
            fields
            core
          }
        }
      }
      versions {
        id
        createdAt
        data
        createdBy {
          name
        }
      }
    }
  }
`;

/** Model for GetRecordDetailsQueryResponse object */
export interface GetRecordDetailsQueryResponse {
  record: Record;
}
