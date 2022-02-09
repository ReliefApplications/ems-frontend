import { AuthConfig } from 'angular-oauth2-oidc';

const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://ems-safe-test.who.int/backoffice/',
  postLogoutRedirectUri: 'https://ems-safe-test.who.int/backoffice/auth',
  clientId: '021202ac-d23b-4757-83e3-f6ecde12266b',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

export const environment = {
  production: true,
  apiUrl: 'https://ems-safe-test.who.int/api',
  subscriptionApiUrl: 'wss://ems-safe-test.who.int/api',
  frontOfficeUri: 'https://ems-safe-test.who.int/',
  backOfficeUri: 'https://ems-safe-test.who.int/backoffice/',
  module: 'backoffice',
  availableLanguages: ['en'],
  authConfig,
  esriApiKey: 'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg',
};
