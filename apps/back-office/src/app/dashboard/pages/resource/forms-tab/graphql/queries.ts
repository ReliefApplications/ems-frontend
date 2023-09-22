import { gql } from 'apollo-angular';

/** Graphql query for getting a resource by its id */
export const GET_RESOURCE_FORMS = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      id
      forms {
        id
        name
        status
        createdAt
        recordsCount
        core
        canUpdate
        canDelete
        canCreateRecords
      }
      canUpdate
    }
  }
`;
