import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort';

const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://dms.oortcloud.tech/',
  postLogoutRedirectUri: 'https://dms.oortcloud.tech/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
};

/**
 * Environment file of OORT production platform.
 */
export const environment = {
  production: true,
  apiUrl: 'https://dms.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://dms.oortcloud.tech/api',
  frontOfficeUri: 'https://dms.oortcloud.tech',
  backOfficeUri: 'https://dms.oortcloud.tech/admin/',
  module: 'frontoffice',
  availableLanguages: ['en'],
  authConfig,
  theme,
};
