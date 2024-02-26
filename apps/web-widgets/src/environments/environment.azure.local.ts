import { environment as devEnvironment } from './environment.azure.dev';
import { Environment } from './environment.type';

/**
 * Environment file for local development.
 * Similar to dev, but with different urls, so no CORS issues.
 */
export const environment: Environment = {
  ...devEnvironment,
  tinymceBaseUrl:
    'https://whoemssafedsta03.blob.core.windows.net/shared/dev/tinymce/',
  i18nUrl: 'https://whoemssafedsta03.blob.core.windows.net/shared/dev/i18n/',
  noAccessMessage: {
    title: (pageName: string) =>
      `Your user account does not have access to ${pageName}`,
    subtitle: 'Please contact ems2@who.int for more information',
  },
};
