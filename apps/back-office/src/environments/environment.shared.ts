/**
 * Shared environment for back-office
 */
export const sharedEnvironment = {
  module: 'backoffice',
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../../../../package.json').version,
};
