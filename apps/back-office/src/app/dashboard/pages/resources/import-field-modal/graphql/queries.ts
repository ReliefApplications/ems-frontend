import { gql } from 'apollo-angular';

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_BY_ID = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      importField
      coreForm {
        id
        structure
      }
    }
  }
`;
