import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.local';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

// const authConfig: AuthConfig = {
//   issuer:
//     'https://login.microsoftonline.com/fbacd48d-ccf4-480d-baf0-31048368055f/v2.0',
//   redirectUri: 'http://localhost:4200/',
//   postLogoutRedirectUri: 'http://localhost:4200/auth/',
//   clientId: 'd62083d8-fdc0-4a6a-8618-652380eebdb9',
//   scope: 'openid profile email offline_access',
//   responseType: 'code',
//   showDebugInformation: true,
//   strictDiscoveryDocumentValidation: false,
// };

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer: 'https://id-dev.oortcloud.tech/auth/realms/oort',
  redirectUri: 'http://localhost:4200/',
  postLogoutRedirectUri: 'http://localhost:4200/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
};

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: false,
  apiUrl: 'https://oort-dev.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  frontOfficeUri: 'http://localhost:4200/',
  backOfficeUri: 'http://localhost:4200/',
  availableLanguages: ['en', 'fr', 'test'],
  authConfig,
  esriApiKey:
    'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg',
  theme,
};
