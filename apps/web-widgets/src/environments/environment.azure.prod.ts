import { AuthConfig } from 'angular-oauth2-oidc';
import { sharedAzureEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://hems.who.int/widgets/',
  postLogoutRedirectUri: 'https://hems.who.int/widgets/auth/',
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
  apiUrl: 'https://hems.who.int/api',
  subscriptionApiUrl: 'wss://hems.who.int/api',
  frontOfficeUri: 'https://hems.who.int/apps/',
  backOfficeUri: 'https://hems.who.int/backoffice/',
  authConfig,
  tinymceBaseUrl: 'https://hems.who.int/app-builder/tinymce/',
  i18nUrl: 'https://hems.who.int/app-builder/i18n/',
  user: {
    attributes: ['country', 'region', 'location', 'department'],
  },
  admin0Url: 'https://hems.who.int/app-builder/admin0.json',
  csApiUrl: 'https://hems.who.int/csapi/api',
  csDocUrl: 'https://hems.who.int/csdocui',
};
