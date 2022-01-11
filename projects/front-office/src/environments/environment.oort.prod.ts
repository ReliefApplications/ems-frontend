/**
 * Environment file of OORT production platform.
 */
export const environment = {
  production: true,
  apiUrl: 'https://dms.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://dms.oortcloud.tech/api',
  clientId: 'a85e101e-e193-4a3f-8911-c6e89bc973e6',
  authority: 'https://login.microsoftonline.com/common',
  redirectUrl: 'https://dms.oortcloud.tech/',
  postLogoutRedirectUri: 'https://dms.oortcloud.tech/auth',
  frontOfficeUri: 'https://dms.oortcloud.tech',
  backOfficeUri: 'https://dms.oortcloud.tech/admin/',
  module: 'frontoffice',
  availableLanguages: ['en']
};
