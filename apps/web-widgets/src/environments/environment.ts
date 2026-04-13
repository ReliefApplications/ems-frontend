import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/9050ebef-ac5b-4440-ba99-b16aece6685a/v2.0',
  redirectUri: 'http://localhost:4200/',
  postLogoutRedirectUri: 'http://localhost:4200/auth/',
  clientId: '95cadd47-d31d-4008-af63-72d8be6cab55',
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
  csDocUrl: 'https://hems-dev.who.int/csdocui',
};
