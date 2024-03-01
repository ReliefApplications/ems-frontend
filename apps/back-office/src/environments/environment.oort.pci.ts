import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/pci/pci.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://pci.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://pci.oortcloud.tech/admin/auth/',
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
  apiUrl: 'https://pci.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://pci.oortcloud.tech/api',
  frontOfficeUri: 'https://pci.oortcloud.tech',
  backOfficeUri: 'https://pci.oortcloud.tech/admin/',
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
