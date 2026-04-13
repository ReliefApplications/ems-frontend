import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.local';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
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

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: false,
  apiUrl: 'http://localhost:3000',
  subscriptionApiUrl: 'ws://localhost:3000',
  frontOfficeUri: 'http://localhost:4200/',
  backOfficeUri: 'http://localhost:4200/',
  availableLanguages: ['en', 'fr', 'test'],
  authConfig,
  theme,
  admin0Url: 'https://hems-dev.who.int/app-builder/admin0.json',
  csDocUrl: 'https://hems-dev.who.int/csdocui',
};
