/**
 * Production environment file.
 */
export const environment = {
  production: true,
  apiUrl: 'https://safe-api.development.humanitarian.tech',
  subscriptionApiUrl: 'wss://safe-api.development.humanitarian.tech',
  clientId: 'a85e101e-e193-4a3f-8911-c6e89bc973e6',
  authority: 'https://login.microsoftonline.com/common',
  redirectUrl: 'https://safe.development.humanitarian.tech',
  postLogoutRedirectUri: 'https://safe.development.humanitarian.tech/auth',
  frontOfficeUri: 'https://safe.development.humanitarian.tech/',
  backOfficeUri: 'https://safe-backoffice.development.humanitarian.tech/',
  module: 'frontoffice'
};
