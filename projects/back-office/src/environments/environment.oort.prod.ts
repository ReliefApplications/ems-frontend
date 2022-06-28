import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';

/**
 * Authentication parameters for oort production server.
 */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/fbacd48d-ccf4-480d-baf0-31048368055f/v2.0',
  redirectUri: 'https://dms.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://dms.oortcloud.tech/admin/auth',
  clientId: 'a85e101e-e193-4a3f-8911-c6e89bc973e6',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/**
 * Environment file for oort production server.
 */
export const environment = {
  production: true,
  apiUrl: 'https://dms.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://dms.oortcloud.tech/api',
  frontOfficeUri: 'https://dms.oortcloud.tech',
  backOfficeUri: 'https://dms.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['en'],
  authConfig,
  theme,
};
