import { gql } from 'apollo-angular';
import { Setting } from '@safe/builder';

/** Edit Setting mutation */
export const EDIT_SETTING = gql`
  mutation editSetting($userManagement: JSON) {
    editSetting(userManagement: $userManagement) {
      userManagement {
        local
        apiConfiguration {
          id
          name
        }
        serviceAPI
        attributesMapping
      }
    }
  }
`;

/** Interface of Edit Setting mutation response */
export interface EditSettingMutationResponse {
  loading: boolean;
  editSetting: Setting;
}
