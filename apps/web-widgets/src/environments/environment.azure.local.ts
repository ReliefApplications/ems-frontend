import { environment as devEnvironment } from './environment.azure.dev';

/**
 * Environment file for local development.
 * Similar to dev, but with different urls, so no CORS issues.
 */
export const environment = {
  ...devEnvironment,
  tinymceBaseUrl:
    'https://whoemssafedsta03.blob.core.windows.net/shared/dev/tinymce/',
  i18nUrl: 'https://whoemssafedsta03.blob.core.windows.net/shared/dev/i18n/',
};
