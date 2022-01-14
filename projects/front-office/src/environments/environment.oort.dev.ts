import { AuthenticationType } from '@safe/builder';

/**
 * Environment file of OORT development platform.
 */
export const environment = {
  production: true,
  apiUrl: 'https://oort-dev.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://oort-dev.oortcloud.tech/api',
  clientId: 'oort-client',
  authority: 'https://id-dev.oortcloud.tech/auth',
  realm: 'oort',
  redirectUrl: 'https://oort-dev.oortcloud.tech/',
  postLogoutRedirectUri: 'https://oort-dev.oortcloud.tech/auth',
  frontOfficeUri: 'https://oort-dev.oortcloud.tech',
  backOfficeUri: 'https://oort-dev.oortcloud.tech/admin/',
  module: 'frontoffice',
  availableLanguages: ['en', 'test'],
  authenticationType: AuthenticationType.keycloak,
};
