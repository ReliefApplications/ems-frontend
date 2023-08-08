import { AuthConfig } from 'angular-oauth2-oidc';

/**
 * Interface of Angular environment configuration.
 */
export interface Environment {
  module: string;
  version: any;
  production: boolean;
  apiUrl: string;
  subscriptionApiUrl: string;
  frontOfficeUri: string;
  backOfficeUri: string;
  availableLanguages: string[];
  authConfig: AuthConfig;
  esriApiKey: string;
  theme: any;
  availableWidgets: string[];
  sentry?: any;
}
