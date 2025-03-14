/**
 * Shared environment for front-office
 */
export const sharedEnvironment = {
  /* cSpell:disable */
  module: 'frontoffice',
  maxFileSize: 7, // transformed into MB later, just indicate number of MB there
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../../../../package.json').version,
  esriApiKey:
    'AAPK6020068836884707b511570bfb55c042Y7JsUDJU7Dg19M1paHAURrcaX7rPUEnxZj1a_-rDCRSrzSSluutrv3vNaDRnpb9N',
  /* cSpell:enable */
};
