import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

// /** Authentication configuration */
// const authConfig: AuthConfig = {
//   issuer: 'https://id-dev.oortcloud.tech/realms/oort',
//   redirectUri: 'http://localhost:4200/',
//   postLogoutRedirectUri: 'http://localhost:4200/auth/',
//   clientId: 'oort-client',
//   scope: 'openid profile email offline_access',
//   responseType: 'code',
//   showDebugInformation: true,
// };

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'http://localhost:4200/',
  postLogoutRedirectUri: 'http://localhost:4200/auth/',
  clientId: '021202ac-d23b-4757-83e3-f6ecde12266b',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/**
 * Environment file for local development.
 */
export const environment: Environment = {
  ...sharedEnvironment,
  production: false,
  apiUrl: 'http://localhost:3000',
  subscriptionApiUrl: 'ws://localhost:3000',
  frontOfficeUri: 'http://localhost:4200/',
  backOfficeUri: 'http://localhost:4200/',
  availableLanguages: ['en', 'test'],
  authConfig,
  theme,
  tinymceBaseUrl: '',
  i18nUrl: '',
};
