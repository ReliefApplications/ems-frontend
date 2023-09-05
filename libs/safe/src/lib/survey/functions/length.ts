import { GlobalOptions } from '../types';

/**
 * Returns the length of an array.
 *
 * @param params params passed to the function
 * @returns The length of the array.
 */
const length = (params: any[]) => {
  if (!Array.isArray(params[0])) return 0;
  return params[0].length;
};

/**
 *  Generator for the custom function length.
 *
 * @param _ Global options
 * @returns The custom function length
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => length;
