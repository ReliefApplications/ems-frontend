import { gql } from 'apollo-angular';
import { ApiConfiguration } from '../../../models/apiConfiguration.model';

// === EDIT API CONFIGURATION ===
/** Edit API configuration mutation definition */
export const EDIT_API_CONFIGURATION = gql`
  mutation editApiConfiguration(
    $id: ID!
    $name: String
    $status: Status
    $authType: AuthType
    $endpoint: String
    $graphQLEndpoint: String
    $pingUrl: String
    $settings: JSON
    $permissions: JSON
    $userToken: String
    $userId: String
  ) {
    editApiConfiguration(
      id: $id
      name: $name
      status: $status
      authType: $authType
      endpoint: $endpoint
      graphQLEndpoint: $graphQLEndpoint
      pingUrl: $pingUrl
      settings: $settings
      permissions: $permissions
      userToken: $userToken
      userId: $userId
    ) {
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
      userToken
      userId
    }
  }
`;

/** Edit API configuration gql mutation response interface */
export interface EditApiConfigurationMutationResponse {
  editApiConfiguration: ApiConfiguration;
}
