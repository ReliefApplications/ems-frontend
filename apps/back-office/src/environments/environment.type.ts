import { AuthConfig } from 'angular-oauth2-oidc';

/**
 * Interface for User environment configuration.
 */
interface UserConfiguration {
  attributes?: string[];
}

/**
 * Interface of Angular environment configuration.
 */
export interface Environment {
  href?: string;
  module: string;
  version: any;
  production: boolean;
  serviceWorker?: boolean;
  apiUrl: string;
  subscriptionApiUrl: string;
  frontOfficeUri: string;
  backOfficeUri: string;
  /**
   * Base URL of the public-forms application. When set, the form builder
   * displays actions to copy / open the public link of forms marked as public.
   */
  publicFormsUri?: string;
  availableLanguages: string[];
  authConfig: AuthConfig;
  esriApiKey: string;
  theme: any;
  availableWidgets: string[];
  sentry?: any;
  maxFileSize?: number;
  user?: UserConfiguration;
  admin0Url?: string;
  csApiUrl?: string;
  csDocUrl?: string;
  /** Hides the date & time format picker in the preferences modal */
  hideDateFormatPicker?: boolean;
}
