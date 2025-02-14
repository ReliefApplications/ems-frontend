import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://hems.who.int/apps/',
  postLogoutRedirectUri: 'https://hems.who.int/apps/auth',
  clientId: '8e237c86-3d84-4dda-b38d-b92031d77af1',
  scope:
    'openid profile email offline_access offline_access api://75deca06-ae07-4765-85c0-23e719062833/access_as_user',
  // Last scope is used to authenticate against Common Services
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: true,
  href: '/apps',
  apiUrl: 'https://hems.who.int/api',
  subscriptionApiUrl: 'wss://hems.who.int/api',
  frontOfficeUri: 'https://hems.who.int/apps/',
  backOfficeUri: 'https://hems.who.int/backoffice/',
  availableLanguages: ['en'],
  authConfig,
  theme,
  user: {
    attributes: ['country', 'region', 'location', 'department'],
  },
  admin0Url: 'https://hems.who.int/app-builder/admin0.json',
  csApiUrl: 'https://hems.who.int/csapi/api',
};
