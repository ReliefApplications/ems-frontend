import { theme } from '../themes/pci/pci.prod';
import { AuthConfig } from 'angular-oauth2-oidc';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer: 'https://id.libyatt.ly/auth/realms/oort',
  redirectUri: 'https://libyatt.ly/',
  postLogoutRedirectUri: 'https://libyatt.ly/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: false,
};

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://libyatt.ly/api',
  subscriptionApiUrl: 'wss://libyatt.ly/api',
  frontOfficeUri: 'https://libyatt.ly',
  backOfficeUri: 'https://libyatt.ly/admin/',
  availableLanguages: ['en', 'fr'],
  authConfig,
  theme,
};
