import { gql } from 'apollo-angular';
import { ApiConfiguration } from '@safe/builder';

// === DELETE API CONFIGURATION ===
export const DELETE_API_CONFIGURATION = gql`
  mutation deleteApiConfiguration($id: ID!) {
    deleteApiConfiguration(id: $id) {
      id
    }
  }
`;

export interface DeleteApiConfigurationMutationResponse {
  loading: boolean;
  deleteApiConfiguration: ApiConfiguration;
}

// === ADD API CONFIGURATION ===
export const ADD_API_CONFIGURATIION = gql`
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

export interface AddApiConfigurationMutationResponse {
  loading: boolean;
  addApiConfiguration: ApiConfiguration;
}
