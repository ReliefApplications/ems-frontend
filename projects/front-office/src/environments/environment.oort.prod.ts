import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/oort/oort.prod';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/fbacd48d-ccf4-480d-baf0-31048368055f/v2.0',
  redirectUri: 'https://dms.oortcloud.tech/',
  postLogoutRedirectUri: 'https://dms.oortcloud.tech/auth',
  clientId: 'a85e101e-e193-4a3f-8911-c6e89bc973e6',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/** Environment configuration */
export const environment = {
  production: true,
  apiUrl: 'https://dms.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://dms.oortcloud.tech/api',
  frontOfficeUri: 'https://dms.oortcloud.tech',
  backOfficeUri: 'https://dms.oortcloud.tech/admin/',
  module: 'frontoffice',
  availableLanguages: ['en'],
  authConfig,
  theme,
};
