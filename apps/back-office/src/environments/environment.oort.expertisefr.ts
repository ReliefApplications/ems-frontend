import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/expertisefr/expertisefr.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id-tess-mav.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://tess-mav.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://tess-mav.oortcloud.tech/admin/auth/',
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
  apiUrl: 'https://tess-mav.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://tess-mav.oortcloud.tech/api',
  frontOfficeUri: 'https://tess-mav.oortcloud.tech',
  backOfficeUri: 'https://tess-mav.oortcloud.tech/admin/',
  availableLanguages: ['en', 'fr'],
  authConfig,
  esriApiKey: '',
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
