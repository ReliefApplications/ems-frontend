import { AuthConfig } from 'angular-oauth2-oidc';
import { sharedAzureEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://hems-dev.who.int/widgets/',
  postLogoutRedirectUri: 'https://hems-dev.who.int/widgets/auth/',
  clientId: '021202ac-d23b-4757-83e3-f6ecde12266b',
  scope:
    'openid profile email offline_access api://75deca06-ae07-4765-85c0-23e719062833/access_as_user',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/**
 * Environment file for local development.
 */
export const environment: Environment = {
  ...sharedAzureEnvironment,
  apiUrl: 'https://hems-dev.who.int/api',
  subscriptionApiUrl: 'wss://hems-dev.who.int/api',
  frontOfficeUri: 'https://hems-dev.who.int/apps/',
  backOfficeUri: 'https://hems-dev.who.int/backoffice/',
  authConfig,
  tinymceBaseUrl:
    'https://whoemssafedsta03.blob.core.windows.net/shared/dev/tinymce',
  i18nUrl: 'https://whoemssafedsta03.blob.core.windows.net/shared/dev/i18n/',
  admin0Url: 'https://hems-dev.who.int/app-builder/admin0.json',
  csApiUrl: 'https://hems-dev.who.int/csapi/api',
  user: {
    attributes: ['country', 'region', 'location', 'department'],
  },
};
