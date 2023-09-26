import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default';
import { sharedEnvironment } from './environment.shared';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://ems-safe-test.who.int/widgets/',
  postLogoutRedirectUri: 'https://ems-safe-test.who.int/widgets/auth/',
  clientId: '021202ac-d23b-4757-83e3-f6ecde12266b',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/**
 * Environment file for local development.
 */
export const environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://ems-safe-test.who.int/api',
  subscriptionApiUrl: 'wss://ems-safe-test.who.int/api',
  frontOfficeUri: 'https://ems-safe-test.who.int/',
  backOfficeUri: 'https://ems-safe-test.who.int/backoffice/',
  module: 'widgets',
  availableLanguages: ['en', 'test'],
  authConfig,
  theme,
};
