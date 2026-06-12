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
  // set to true to hide the date & time format picker in the preferences modal
  hideDateFormatPicker: true,
  /* cSpell:enable */
};
