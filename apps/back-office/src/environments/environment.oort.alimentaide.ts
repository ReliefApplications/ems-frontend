import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://alimentaide-973-guyane.oortcloud.tech/admin/',
  postLogoutRedirectUri:
    'https://alimentaide-973-guyane.oortcloud.tech/admin/auth/',
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
  apiUrl: 'https://alimentaide-973-guyane.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://alimentaide-973-guyane.oortcloud.tech/api',
  frontOfficeUri: 'https://alimentaide-973-guyane.oortcloud.tech',
  backOfficeUri: 'https://alimentaide-973-guyane.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['fr', 'en'],
  authConfig,
  esriApiKey:
    'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg',
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
