import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  /* cSpell:disable */
  issuer: 'https://id.oortcloud.tech/auth/realms/oort-demo',
  redirectUri: 'https://demo.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://demo.oortcloud.tech/admin/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  /* cSpell:enable */
};

/**
 * Environment file for local development.
 */
export const environment: Environment = {
  /* cSpell:disable */
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://demo.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://demo.oortcloud.tech/api',
  frontOfficeUri: 'https://demo.oortcloud.tech',
  backOfficeUri: 'https://demo.oortcloud.tech/admin/',
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
  ],
  /* cSpell:enable */
};
