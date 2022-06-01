import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.prod';

const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://ems-safe.who.int/',
  postLogoutRedirectUri: 'https://ems-safe.who.int/auth',
  clientId: '8e237c86-3d84-4dda-b38d-b92031d77af1',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/**
 * Environment file of production platform.
 */
export const environment = {
  production: true,
  apiUrl: 'https://ems-safe.who.int/api',
  subscriptionApiUrl: 'wss://ems-safe.who.int/api',
  clientId: '8e237c86-3d84-4dda-b38d-b92031d77af1',
  authority:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590',
  realm: '',
  redirectUrl: 'https://ems-safe.who.int',
  postLogoutRedirectUri: 'https://ems-safe.who.int/auth',
  frontOfficeUri: 'https://ems-safe.who.int/',
  backOfficeUri: 'https://ems-safe.who.int/backoffice/',
  module: 'frontoffice',
  availableLanguages: ['en'],
  authConfig,
  esriApiKey:
    'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg',
  theme,
};
