import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/lift/lift.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id-lift.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://lift.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://lift.oortcloud.tech/admin/auth/',
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
  apiUrl: 'https://lift.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://lift.oortcloud.tech/api',
  frontOfficeUri: 'https://lift.oortcloud.tech',
  backOfficeUri: 'https://lift.oortcloud.tech/admin/',
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
