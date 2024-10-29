import { gql } from 'apollo-angular';

/** Graphql request for getting resource data */
export const GET_RESOURCE = gql`
  query EditButtonActionModal_GetResource($resource: ID!) {
    resource(id: $resource) {
      id
      name
      queryName
      forms {
        id
        name
      }
      fields
    }
  }
`;
