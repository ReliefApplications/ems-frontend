import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';

/**
 * Authentification configuration
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
export const environment = {
  production: true,
  apiUrl: 'https://lift.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://lift.oortcloud.tech/api',
  frontOfficeUri: 'https://lift.oortcloud.tech',
  backOfficeUri: 'https://lift.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['en', 'fr'],
  authConfig,
  esriApiKey: '',
  theme,
  availableWidgets: ['chart', 'grid', 'editor', 'map'],
};
