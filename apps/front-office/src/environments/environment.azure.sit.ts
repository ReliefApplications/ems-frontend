import { AuthConfig } from 'angular-oauth2-oidc';
import { theme } from '../themes/default/default.uat';
import { sharedEnvironment } from './environment.shared';
import { Environment } from './environment.type';

/** Authentication configuration of the module. */
const authConfig: AuthConfig = {
  issuer:
    'https://login.microsoftonline.com/f610c0b7-bd24-4b39-810b-3dc280afb590/v2.0',
  redirectUri: 'https://ems-safe-sit.who.int/',
  postLogoutRedirectUri: 'https://ems-safe-sit.who.int/auth',
  clientId: '021202ac-d23b-4757-83e3-f6ecde12266b',
  scope: 'openid profile email offline_access',
  responseType: 'code',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
};

/** Environment configuration */
export const environment: Environment = {
  ...sharedEnvironment,
  production: true,
  apiUrl: 'https://ems-safe-sit.who.int/api',
  subscriptionApiUrl: 'wss://ems-safe-sit.who.int/api',
  frontOfficeUri: 'https://ems-safe-sit.who.int/',
  backOfficeUri: 'https://ems-safe-sit.who.int/backoffice/',
  availableLanguages: ['en'],
  authConfig,
  esriApiKey:
    'AAPKf2bae9b3f32943e2a8d58b0b96ffea3fj8Vt8JYDt1omhzN_lONXPRHN8B89umU-pA9t7ze1rfCIiiEVXizYEiFRFiVrl6wg',
  theme,
  sentry: {
    environment: 'testing',
    dns: 'https://da63b46285f94315b2d6f8e9c69d7c8c@o4505563078918144.ingest.sentry.io/4505563106312192',
    tracePropagationTargets: ['ems-safe-test.who.int'],
  },
};
