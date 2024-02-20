import { theme } from '../themes/pci/pci.prod';
import { AuthConfig } from 'angular-oauth2-oidc';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://pci.oortcloud.tech/',
  postLogoutRedirectUri: 'https://pci.oortcloud.tech/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: false,
};

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://pci.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://pci.oortcloud.tech/api',
  frontOfficeUri: 'https://pci.oortcloud.tech',
  backOfficeUri: 'https://pci.oortcloud.tech/admin/',
  availableLanguages: ['en'],
  authConfig,
  theme,
};
