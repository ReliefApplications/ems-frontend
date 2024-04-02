import { theme } from '../themes/pci/pci.prod';
import { AuthConfig } from 'angular-oauth2-oidc';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer: 'https://id-ltkmp.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://ltkmp.oortcloud.tech/',
  postLogoutRedirectUri: 'https://ltkmp.oortcloud.tech/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: false,
};

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://ltkmp.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://ltkmp.oortcloud.tech/api',
  frontOfficeUri: 'https://ltkmp.oortcloud.tech',
  backOfficeUri: 'https://ltkmp.oortcloud.tech/admin/',
  availableLanguages: ['en', 'fr'],
  authConfig,
  theme,
};
