import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentification configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id-tess-mav.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://tess-mav.oortcloud.tech/',
  postLogoutRedirectUri: 'https://tess-mav.oortcloud.tech/auth/',
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
};
