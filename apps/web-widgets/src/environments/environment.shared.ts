import { theme } from '../themes/default';

/**
 * Shared environment for back-office
 */
export const sharedEnvironment = {
  module: 'webwidgets',
  maxFileSize: 7, // transformed into MB later, just indicate number of MB there
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../../../../package.json').version,
  esriApiKey:
    'AAPK6020068836884707b511570bfb55c042Y7JsUDJU7Dg19M1paHAURrcaX7rPUEnxZj1a_-rDCRSrzSSluutrv3vNaDRnpb9N',
};

/** Shared azure environment */
export const sharedAzureEnvironment = {
  ...sharedEnvironment,
  production: true,
  availableLanguages: ['en', 'test'],
  theme,
  messages: {
    unauthorized: {
      title: 'Your user account does not have access to this content.',
      footer:
        'Please contact <a class="underline text-primary-500 hover:text-primary-600" href="mailto:ems2@who.int">ems2@who.int</a> for more information.',
    },
  },
};
