import { gql } from 'apollo-angular';

/** Edit record mutation */
export const EDIT_RECORD = gql`
  mutation editRecord($id: ID!, $data: JSON) {
    editRecord(id: $id, data: $data, skipValidation: true) {
      id
      data
    }
  }
`;