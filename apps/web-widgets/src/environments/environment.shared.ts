import { esriApiKey } from '@oort-front/shared';
import { theme } from '../themes/default';

/**
 * Shared environment for back-office
 */
export const sharedEnvironment = {
  /* cSpell:disable */
  module: 'webwidgets',
  maxFileSize: 7, // transformed into MB later, just indicate number of MB there
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../../../../package.json').version,
  esriApiKey: esriApiKey,
  /* cSpell:enable */
};

/** Shared azure environment */
export const sharedAzureEnvironment = {
  /* cSpell:disable */
  ...sharedEnvironment,
  production: true,
  availableLanguages: ['en', 'fr', 'uk', 'test'],
  theme,
  /* cSpell:enable */
};
