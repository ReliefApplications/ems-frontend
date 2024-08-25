import { GlobalOptions } from '../types';

/**
 * Truncates the fractional portion of a decimal number to return an integer.
 *
 * @param params The number to be transformed to integer.
 * @returns The integer number
 */
const int = (params: any[]) => {
  const [decimal] = params;
  return Math.trunc(decimal);
};

/**
 *  Generator for the custom function replace.
 *
 * @param _ Global options
 * @returns The custom function replace
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => int;
