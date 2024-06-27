import { GlobalOptions } from '../types';

/**
 * Converts params to a string.
 *
 * @param params The param to convert to string.
 * @returns the string
 */
function string(params: any[]) {
  const [toStringify] = params;
  if (toStringify) {
    return JSON.stringify(toStringify);
  }
  return '';
}

/**
 *  Generator for the custom function string.
 *
 * @param _ Global options
 * @returns The custom function string
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => string;
