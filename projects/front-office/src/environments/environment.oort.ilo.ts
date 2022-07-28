import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/ilo',
  redirectUri: 'https://c2a-durban.oortcloud.tech/',
  postLogoutRedirectUri: 'https://c2a-durban.oortcloud.tech/auth/',
  clientId: 'ilo-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: false,
};

/** Environmnet configuration */
export const environment = {
  production: true,
  apiUrl: 'https://c2a-durban.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://c2a-durban.oortcloud.tech/api',
  frontOfficeUri: 'https://c2a-durban.oortcloud.tech',
  backOfficeUri: 'https://c2a-durban.oortcloud.tech/admin/',
  module: 'frontoffice',
  availableLanguages: ['en', 'fr'],
  authConfig,
  theme,
};
