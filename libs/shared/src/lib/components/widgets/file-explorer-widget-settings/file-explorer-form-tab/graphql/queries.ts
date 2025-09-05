import { gql } from 'apollo-angular';

/** Graphql request for getting resource by id */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      forms {
        id
        name
      }
    }
  }
`;
