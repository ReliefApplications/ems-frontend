import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.local';
import { sharedEnvironment } from './environment.shared';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id-dev.oortcloud.tech/auth/realms/oort',
  redirectUri: 'http://localhost:4200/',
  postLogoutRedirectUri: 'http://localhost:4200/auth/',
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
  production: false,
  apiUrl: 'https://oort-dev.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  frontOfficeUri: 'http://localhost:4200/',
  backOfficeUri: 'http://localhost:4200/',
  module: 'backoffice',
  availableLanguages: ['en', 'fr', 'test'],
  authConfig,
  esriApiKey:
    'AAPK6020068836884707b511570bfb55c042Y7JsUDJU7Dg19M1paHAURrcaX7rPUEnxZj1a_-rDCRSrzSSluutrv3vNaDRnpb9N',
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
