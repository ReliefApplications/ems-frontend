import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.local';

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

const authConfig: AuthConfig = {
  issuer: 'https://id-dev.oortcloud.tech/auth/realms/oort',
  redirectUri: 'http://localhost:4200/',
  postLogoutRedirectUri: 'http://localhost:4200/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
};

/**
 * Environment file for local development.
 */
export const environment = {
  production: false,
  // apiUrl: 'https://oort-dev.oortcloud.tech/api',
  // subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  apiUrl: 'http://localhost:3000',
  subscriptionApiUrl: 'ws://localhost:3000',
  frontOfficeUri: 'http://localhost:4200/',
  backOfficeUri: 'http://localhost:4200/',
  module: 'backoffice',
  availableLanguages: ['en', 'fr', 'test'],
  authConfig,
  esriApiKey:
    'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg',
  theme,
};
