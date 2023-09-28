import { gql } from 'apollo-angular';

/** Get resource by id to get its fields */
export const GET_RESOURCE_FIELDS = gql`
  query GetResourceById($id: ID!) {
    resource(id: $id) {
      fields
    }
  }
`;
