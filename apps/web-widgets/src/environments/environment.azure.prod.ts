import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default';
import { sharedEnvironment } from './environment.shared';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://ems-safe.who.int/widgets/',
  postLogoutRedirectUri: 'https://ems-safe.who.int/widgets/auth/',
  clientId: '8e237c86-3d84-4dda-b38d-b92031d77af1',
  scope:
    'openid profile email offline_access api://75deca06-ae07-4765-85c0-23e719062833/access_as_user',
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
  apiUrl: 'https://ems-safe.who.int/api',
  subscriptionApiUrl: 'wss://ems-safe.who.int/api',
  frontOfficeUri: 'https://ems-safe.who.int/',
  backOfficeUri: 'https://ems-safe.who.int/backoffice/',
  module: 'widgets',
  availableLanguages: ['en', 'test'],
  authConfig,
  theme,
  tinymceBaseUrl: 'https://ems2.who.int/app-builder/tinymce',
  i18nUrl: 'https://ems2.who.int/app-builder/i18n/',
};
