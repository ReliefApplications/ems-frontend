import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id-mab.unesco.oortcloud.tech/realms/oort',
  redirectUri: 'https://mab.unesco.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://mab.unesco.oortcloud.tech/admin/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
};

/**
 * Environment file for local development.
 */
export const environment: Environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://mab.unesco.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://mab.unesco.oortcloud.tech/api',
  frontOfficeUri: 'https://mab.unesco.oortcloud.tech',
  backOfficeUri: 'https://mab.unesco.oortcloud.tech/admin/',
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
