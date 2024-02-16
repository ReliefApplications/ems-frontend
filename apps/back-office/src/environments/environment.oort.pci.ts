import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/pci/pci.prod';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/**
 * Authentication configuration
 */
const authConfig: AuthConfig = {
  issuer: 'https://id.oortcloud.tech/auth/realms/oort',
  redirectUri: 'https://pcistafrontend01.z28.web.core.windows.net/',
  postLogoutRedirectUri:
    'https://pcistafrontend01.z28.web.core.windows.net/auth/',
  clientId: 'oort-client',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: false,
};

/**
 * Environment file for local development.
 */
export const environment: Environment = {
  ...sharedEnvironment,

  production: true,
  apiUrl: 'https://pci-apiwebapp.azurewebsites.net/',
  subscriptionApiUrl: 'wss://pci-apiwebapp.azurewebsites.net/',
  frontOfficeUri: 'https://pcistafrontend01.z28.web.core.windows.net/',
  backOfficeUri: 'https://pcistafrontend01.z28.web.core.windows.net/',
  module: 'backoffice',
  availableLanguages: ['en'],
  authConfig,
  theme,
  availableWidgets: [
    'donut-chart',
    'line-chart',
    'bar-chart',
    'column-chart',
    'pie-chart',
    'grid',
    'text',
    'map',
    'summaryCard',
    'tabs',
  ],
};
