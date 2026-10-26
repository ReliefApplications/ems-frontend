import { esriApiKey } from '@oort-front/shared';

/**
 * Shared environment for front-office
 */
export const sharedEnvironment = {
  /* cSpell:disable */
  module: 'frontoffice',
  maxFileSize: 7, // transformed into MB later, just indicate number of MB there
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../../../../package.json').version,
  esriApiKey: esriApiKey,
  captcha: {
    // Cloudflare Turnstile site key, used to verify unauthenticated form submissions
    siteKey: '0x4AAAAAADzXikY8kjwvDZSe',
  },
  /* cSpell:enable */
};
