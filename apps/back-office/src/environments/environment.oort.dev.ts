import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.dev';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  /* cSpell:disable */
  issuer: 'https://id-dev.oortcloud.tech/realms/oort',
  redirectUri: 'https://oort-dev.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://oort-dev.oortcloud.tech/admin/auth/',
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
  apiUrl: 'https://oort-dev.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  frontOfficeUri: 'https://oort-dev.oortcloud.tech',
  backOfficeUri: 'https://oort-dev.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['en', 'fr', 'test'],
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
  ],
  /* cSpell:enable */
};
