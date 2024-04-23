import { GlobalOptions } from '../types';

/**
 * Checks if the string ends with the specified character
 *
 * @param params the string and the characters to be searched at the end of the string
 * @returns true if the string ends with the specified characters
 */
export const endsWith = (params: any[]) => {
  const originalString = params[0];
  const characters = params[1];

  return originalString?.endsWith(characters) ?? false;
};

/**
 *  Generator for the custom function endsWith.
 *
 * @param _ Global options
 * @returns The custom function endsWith
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => endsWith;
