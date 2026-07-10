import { gql } from 'apollo-angular';

/** Graphql request for getting the reverse links of a resource */
export const GET_RESOURCE_RELATED_FIELDS = gql`
  query GetResourceRelatedFields($id: ID!) {
    resource(id: $id) {
      id
      relatedFields
    }
  }
`;
