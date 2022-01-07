/**
 * Environment file for local development with keycloak auth.
 */
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  subscriptionApiUrl: 'ws://localhost:3000',
  clientId: 'myclient',
  authority: 'http://localhost:8080/auth',
  realm: 'Oort',
  redirectUrl: 'http://localhost:4200',
  postLogoutRedirectUri: 'http://localhost:4200/auth',
  frontOfficeUri: 'http://localhost:4200/',
  backOfficeUri: 'http://localhost:4200/',
  module: 'backoffice'
};
