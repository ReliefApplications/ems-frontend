import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';

const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://aide-alimentaire-guyane.oortcloud.tech/admin/',
  postLogoutRedirectUri:
    'https://aide-alimentaire-guyane.oortcloud.tech/admin/auth',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: false,
};

export const environment = {
  production: true,
  apiUrl: 'https://aide-alimentaire-guyane.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://aide-alimentaire-guyane.oortcloud.tech/api',
  frontOfficeUri: 'https://aide-alimentaire-guyane.oortcloud.tech',
  backOfficeUri: 'https://aide-alimentaire-guyane.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['en'],
  authConfig,
  theme,
};
