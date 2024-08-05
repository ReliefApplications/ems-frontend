import { GlobalOptions } from '../types';

/**
 * Trim a string, removing whitespace from both ends.
 *
 * @param params The string to trim.
 * @returns The trimmed string.
 */
const trim = (params: any[]) => {
  const str = params[0];

  return typeof str === 'string' ? str.trim() : null;
};

/**
 *  Generator for the custom function trim.
 *
 * @param _ Global options
 * @returns The custom function trim
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => trim;
