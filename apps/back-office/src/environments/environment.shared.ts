/**
 * Shared environment for back-office
 */
export const sharedEnvironment = {
  /* cSpell:disable */
  module: 'backoffice',
  maxFileSize: 7, // transformed into MB later, just indicate number of MB there
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  version: require('../../../../package.json').version,
  esriApiKey:
    'AAPTxy8BH1VEsoebNVZXo8HurCnxSTQxj2ceN8UJa_c_5YzkGC0L_Vyzn6WfiyxiViz6ZGd5U2JoH5ZErKa6RPtA4wdRJOcyAD1nHO2GuT8nsrB6hSxtn4TwxUfgloSkmsbFrbWg-AVB2VRZeSfW8OVDvzm-_MkG9SXpOd6Ctv0Y3jfu1k0XNzbpIN3QeSNaNIYZxYf99-U76DPsz9rdLPUZPaEPRHZvJi4uoMFTNUEgVUc.AT1_d4AzFDjk',
  /* cSpell:enable */
};
