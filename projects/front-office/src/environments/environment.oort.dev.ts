import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.dev';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer: 'https://id-dev.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://oort-dev.oortcloud.tech/',
  postLogoutRedirectUri: 'https://oort-dev.oortcloud.tech/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
};

/** Environment configuration */
export const environment = {
  production: true,
  apiUrl: 'https://oort-dev.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  frontOfficeUri: 'https://oort-dev.oortcloud.tech',
  backOfficeUri: 'https://oort-dev.oortcloud.tech/admin/',
  module: 'frontoffice',
  availableLanguages: ['en', 'fr', 'test'],
  authConfig,
  theme,
};
