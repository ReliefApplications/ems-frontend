import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentification configuration
 */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://ems-safe.who.int/backoffice/',
  postLogoutRedirectUri: 'https://ems-safe.who.int/backoffice/auth',
  clientId: '8e237c86-3d84-4dda-b38d-b92031d77af1',
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
  production: true,
  apiUrl: 'https://ems-safe.who.int/api',
  subscriptionApiUrl: 'wss://ems-safe.who.int/api',
  frontOfficeUri: 'https://ems-safe.who.int/',
  backOfficeUri: 'https://ems-safe.who.int/backoffice/',
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
    'grid',
    'text',
    'summaryCard',
    'tabs',
  ],
};
