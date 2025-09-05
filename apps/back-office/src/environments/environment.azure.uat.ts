import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.uat';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  /* cSpell:disable */
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://hems-test.who.int/backoffice/',
  postLogoutRedirectUri: 'https://hems-test.who.int/backoffice/auth',
  clientId: '021202ac-d23b-4757-83e3-f6ecde12266b',
  scope:
    'openid profile email offline_access api://75deca06-ae07-4765-85c0-23e719062833/access_as_user',
  // Last scope is used to authenticate against Common Services
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  /* cSpell:enable */
};

/**
 * Environment file for local development.
 */
export const environment: Environment = {
  /* cSpell:disable */
  ...sharedEnvironment,
  production: true,
  href: '/backoffice',
  apiUrl: 'https://hems-test.who.int/api',
  subscriptionApiUrl: 'wss://hems-test.who.int/api',
  frontOfficeUri: 'https://hems-test.who.int/apps/',
  backOfficeUri: 'https://hems-test.who.int/backoffice/',
  module: 'backoffice',
  availableLanguages: ['en'],
  authConfig,
  theme,
  availableWidgets: [
    'donut-chart',
    'line-chart',
    'bar-chart',
    'column-chart',
    'pie-chart',
    'polar-chart',
    'radar-chart',
    'grid',
    'text',
    'map',
    'summaryCard',
    'tabs',
    'file-explorer',
  ],
  user: {
    attributes: ['country', 'region', 'location', 'department'],
  },
  admin0Url: 'https://hems-test.who.int/app-builder/admin0.json',
  csApiUrl: 'https://hems-test.who.int/csapi/api',
  csDocUrl: 'https://hems-test.who.int/csdocui',
  /* cSpell:enable */
};
