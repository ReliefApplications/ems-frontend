import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer: 'https://id-dev.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://d3rv4m9pcr8lg2.cloudfront.net/',
  postLogoutRedirectUri: 'https://d3rv4m9pcr8lg2.cloudfront.net/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
};

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://oort-dev.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  frontOfficeUri: 'https://d3rv4m9pcr8lg2.cloudfront.net',
  backOfficeUri: 'https://d3rv4m9pcr8lg2.cloudfront.net/admin/',
  availableLanguages: ['en', 'fr'],
  authConfig,
  theme,
};
