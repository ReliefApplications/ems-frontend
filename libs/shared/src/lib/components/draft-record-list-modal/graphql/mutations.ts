import { gql } from 'apollo-angular';

/** Delete draft record gql mutation definition */
export const DELETE_DRAFT_RECORD = gql`
  mutation deleteDraftRecord($id: ID!) {
    deleteDraftRecord(id: $id) {
      id
    }
  }
`;
