/**
 * Environment file for local development.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  subscriptionApiUrl: 'ws://localhost:3000',
  clientId: 'oort-client',
  authority: 'https://id-dev.oortcloud.tech/auth',
  realm: 'oort',
  redirectUrl: 'http://localhost:4200',
  postLogoutRedirectUri: 'http://localhost:4200/auth',
  frontOfficeUri: 'http://localhost:4200/',
  backOfficeUri: 'http://localhost:4200/',
  module: 'frontoffice',
  availableLanguages: ['en', 'test'],
};
