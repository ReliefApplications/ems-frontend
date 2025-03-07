import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.dev';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://hems-dev.who.int/apps/',
  postLogoutRedirectUri: 'https://hems-dev.who.int/apps/auth',
  clientId: '021202ac-d23b-4757-83e3-f6ecde12266b',
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
  apiUrl: 'https://hems-dev.who.int/api',
  subscriptionApiUrl: 'wss://hems-dev.who.int/api',
  frontOfficeUri: 'https://hems-dev.who.int/apps/',
  backOfficeUri: 'https://hems-dev.who.int/backoffice/',
  availableLanguages: ['en'],
  authConfig,
  theme,
  sentry: {
    environment: 'development',
    dns: 'https://da63b46285f94315b2d6f8e9c69d7c8c@o4505563078918144.ingest.sentry.io/4505563106312192',
    tracePropagationTargets: ['hems-dev.who.int'],
  },
  user: {
    attributes: ['country', 'region', 'location', 'department'],
  },
  admin0Url: 'https://hems-dev.who.int/app-builder/admin0.json',
  csApiUrl: 'https://hems-dev.who.int/csapi/api',
  csDocUrl: 'https://hems-dev.who.int/csdocui',
};
