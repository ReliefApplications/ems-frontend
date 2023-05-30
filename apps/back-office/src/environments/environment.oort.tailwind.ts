import { AuthConfig } from 'angular-oauth2-oidc';
import { sharedEnvironment } from './environment.shared';
import { theme } from '../themes/default/default.prod';

/**
 * Authentification configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id-dev.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://tailwind.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://tailwind.oortcloud.tech/admin/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
};

/**
 * Environment file for local development.
 */
export const environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://oort-dev.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  frontOfficeUri: 'https://tailwind.oortcloud.tech',
  backOfficeUri: 'https://tailwind.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['en', 'fr', 'test'],
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
    'polar-chart',
    'radar-chart',
    'grid',
    'text',
    'map',
    'summaryCard',
  ],
};
