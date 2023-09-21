import { gql } from 'apollo-angular';

/** Get resource */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
    }
  }
`;
