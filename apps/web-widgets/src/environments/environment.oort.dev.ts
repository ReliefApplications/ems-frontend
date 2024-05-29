import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration */
const authConfig: AuthConfig = {
  issuer: 'https://id-dev.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://oort-dev.oortcloud.tech/widgets/',
  postLogoutRedirectUri: 'https://oort-dev.oortcloud.tech/widgets/auth/',
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
  apiUrl: 'https://oort-dev.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  frontOfficeUri: 'http://localhost:4200/',
  backOfficeUri: 'http://localhost:4200/',
  availableLanguages: ['en', 'test'],
  authConfig,
  theme,
  tinymceBaseUrl: '',
  i18nUrl: '',
};
