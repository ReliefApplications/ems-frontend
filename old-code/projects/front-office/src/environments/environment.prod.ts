import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.prod';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/fbacd48d-ccf4-480d-baf0-31048368055f/v2.0',
  redirectUri: 'https://safe-backoffice.development.humanitarian.tech/auth/',
  postLogoutRedirectUri:
    'https://safe-backoffice.development.humanitarian.tech',
  clientId: 'a85e101e-e193-4a3f-8911-c6e89bc973e6',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/** Environment configuration */
export const environment = {
  production: true,
  apiUrl: 'https://safe-api.development.humanitarian.tech',
  subscriptionApiUrl: 'wss://safe-api.development.humanitarian.tech',
  frontOfficeUri: 'https://safe.development.humanitarian.tech/',
  backOfficeUri: 'https://safe-backoffice.development.humanitarian.tech/',
  module: 'frontoffice',
  availableLanguages: ['en'],
  authConfig,
  esriApiKey:
    'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg',
  theme,
};
