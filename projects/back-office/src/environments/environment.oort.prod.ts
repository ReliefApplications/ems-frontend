import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';

const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://dms.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://dms.oortcloud.tech/admin/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
};

export const environment = {
  production: true,
  apiUrl: 'https://dms.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://dms.oortcloud.tech/api',
  frontOfficeUri: 'https://dms.oortcloud.tech',
  backOfficeUri: 'https://dms.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['en', 'fr'],
  authConfig,
  theme,
};
