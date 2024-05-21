import { GlobalOptions } from '../types';

/**
 * Checks if the string begins with the specified character
 *
 * @param params the string and the characters to be searched at the start of the string
 * @returns true if the string begins with the specified characters
 */
export const startsWith = (params: any[]) => {
  const originalString = params[0];
  const characters = params[1];

  return originalString?.startsWith(characters) ?? false;
};

/**
 *  Generator for the custom function startsWith.
 *
 * @param _ Global options
 * @returns The custom function startsWith
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => startsWith;
