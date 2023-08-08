import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://aide-alimentaire-guyane.oortcloud.tech/',
  postLogoutRedirectUri: 'https://aide-alimentaire-guyane.oortcloud.tech/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: false,
};

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://aide-alimentaire-guyane.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://aide-alimentaire-guyane.oortcloud.tech/api',
  frontOfficeUri: 'https://aide-alimentaire-guyane.oortcloud.tech',
  backOfficeUri: 'https://aide-alimentaire-guyane.oortcloud.tech/admin/',
  availableLanguages: ['fr', 'en'],
  authConfig,
  theme,
};
