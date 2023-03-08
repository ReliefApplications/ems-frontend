/**
 * Shared environment for front-office
 */
export const sharedEnvironment = {
  module: 'frontoffice',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../../../../package.json').version,
};
