import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/pci/pci.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id.libyatt.ly/auth/realms/oort',
  redirectUri: 'https://libyatt.ly/admin/',
  postLogoutRedirectUri: 'https://libyatt.ly/admin/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: false,
};

/**
 * Environment file for local development.
 */
export const environment: Environment = {
  ...sharedEnvironment,

  production: true,
  apiUrl: 'https://libyatt.ly/api',
  subscriptionApiUrl: 'wss://libyatt.ly/api',
  frontOfficeUri: 'https://libyatt.ly',
  backOfficeUri: 'https://libyatt.ly/admin/',
  module: 'backoffice',
  availableLanguages: ['en', 'fr'],
  authConfig,
  theme,
  availableWidgets: [
    'form',
    'donut-chart',
    'line-chart',
    'bar-chart',
    'column-chart',
    'pie-chart',
    'grid',
    'text',
    'map',
    'summaryCard',
    'tabs',
  ],
};
