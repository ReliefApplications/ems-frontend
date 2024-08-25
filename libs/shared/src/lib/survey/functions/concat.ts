import { GlobalOptions } from '../types';

/**
 * Concatenates one or more arguments into a single string.
 *
 * @param params The strings to use.
 * @returns the string from the operation
 */
function concat(params: string[]) {
  let finalString = '';
  for (const index in params) {
    finalString = finalString.concat(params[index]);
  }
  return finalString;
}

/**
 *  Generator for the custom function concat.
 *
 * @param _ Global options
 * @returns The custom function concat
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => concat;
