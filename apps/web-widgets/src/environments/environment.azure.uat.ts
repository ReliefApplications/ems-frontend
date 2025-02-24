import { AuthConfig } from 'angular-oauth2-oidc';
import { sharedAzureEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://hems-test.who.int/widgets/',
  postLogoutRedirectUri: 'https://hems-test.who.int/widgets/auth/',
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
  ...sharedAzureEnvironment,
  apiUrl: 'https://hems-test.who.int/api',
  subscriptionApiUrl: 'wss://hems-test.who.int/api',
  frontOfficeUri: 'https://hems-test.who.int/apps/',
  backOfficeUri: 'https://hems-test.who.int/backoffice/',
  authConfig,
  tinymceBaseUrl:
    'https://whoemssafedsta03.blob.core.windows.net/shared/uat/tinymce',
  i18nUrl: 'https://whoemssafedsta03.blob.core.windows.net/shared/uat/i18n/',
  user: {
    attributes: ['country', 'region', 'location', 'department'],
  },
  admin0Url: 'https://hems-test.who.int/app-builder/admin0.json',
  csApiUrl: 'https://hems-test.who.int/csapi/api',
  csDocUrl: 'https://hems-test.who.int/csdocui',
};
