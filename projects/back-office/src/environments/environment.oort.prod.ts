import { AuthenticationType } from '@safe/builder';

export const environment = {
  production: true,
  apiUrl: 'https://dms.oortcloud.tech/api',
  subscriptionApiUrl: 'wss://dms.oortcloud.tech/api',
  clientId: 'a85e101e-e193-4a3f-8911-c6e89bc973e6',
  authority: 'https://login.microsoftonline.com/common',
  realm: '',
  redirectUrl: 'https://dms.oortcloud.tech/admin/',
  postLogoutRedirectUri: 'https://dms.oortcloud.tech/admin/auth',
  frontOfficeUri: 'https://dms.oortcloud.tech',
  backOfficeUri: 'https://dms.oortcloud.tech/admin/',
  module: 'backoffice',
  availableLanguages: ['en'],
  authenticationType: AuthenticationType.azureAD,
};
