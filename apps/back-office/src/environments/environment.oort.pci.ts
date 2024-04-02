import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/pci/pci.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id-ltkmp.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://ltkmp.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://ltkmp.oortcloud.tech/admin/auth/',
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
  apiUrl: 'https://ltkmp.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://ltkmp.oortcloud.tech/api',
  frontOfficeUri: 'https://ltkmp.oortcloud.tech',
  backOfficeUri: 'https://ltkmp.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['en', 'fr'],
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
    'map',
    'summaryCard',
    'tabs',
  ],
};
