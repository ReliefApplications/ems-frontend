import { gql } from 'apollo-angular';
import { ApiConfiguration } from '@oort-front/safe';

// === DELETE API CONFIGURATION ===
/** Delete api config gql mutation definition */
export const DELETE_API_CONFIGURATION = gql`
  mutation deleteApiConfiguration($id: ID!) {
    deleteApiConfiguration(id: $id) {
      id
    }
  }
`;

/** Delete api config gql mutation response interface */
export interface DeleteApiConfigurationMutationResponse {
  deleteApiConfiguration: ApiConfiguration;
}

// === ADD API CONFIGURATION ===
/** Add api config gql mutation definition */
export const ADD_API_CONFIGURATION = gql`
  mutation addApiConfiguration($name: String!) {
    addApiConfiguration(name: $name) {
      id
      name
      status
      authType
      endpoint
      graphQLEndpoint
      pingUrl
      settings
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      canSee
      canUpdate
      canDelete
    }
  }
`;

/** Add api config gql mutation response interface */
export interface AddApiConfigurationMutationResponse {
  addApiConfiguration: ApiConfiguration;
}
