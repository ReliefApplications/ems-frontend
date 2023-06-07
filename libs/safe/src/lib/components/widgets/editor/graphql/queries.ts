import { gql } from 'apollo-angular';
import { Record } from '../../../../../lib/models/record.model';

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
