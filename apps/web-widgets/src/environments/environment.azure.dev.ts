import { AuthConfig } from 'angular-oauth2-oidc';
import { sharedAzureEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://ems-safe-dev.who.int/widgets/',
  postLogoutRedirectUri: 'https://ems-safe-dev.who.int/widgets/auth/',
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
  apiUrl: 'https://ems-safe-dev.who.int/api',
  subscriptionApiUrl: 'wss://ems-safe-dev.who.int/api',
  frontOfficeUri: 'https://ems-safe-dev.who.int/',
  backOfficeUri: 'https://ems-safe-dev.who.int/backoffice/',
  authConfig,
  tinymceBaseUrl:
    'https://whoemssafedsta03.blob.core.windows.net/shared/dev/tinymce',
  i18nUrl: 'https://whoemssafedsta03.blob.core.windows.net/shared/dev/i18n/',
  // tinymceBaseUrl: 'https://ems2-dev.who.int/app-builder/tinymce',
  // i18nUrl: 'https://ems2-dev.who.int/app-builder/i18n/',
  admin0Url:
    'https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services/Detailed_Boundary_ADM0/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson',
};
