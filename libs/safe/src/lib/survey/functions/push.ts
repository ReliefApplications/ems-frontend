import { GlobalOptions } from '../types';

/**
 * Push a value to an array
 *
 * @param params The array and the value to push.
 * @returns The new array.
 */
const push = (params: any[]) => {
  const array = params[0];
  const value = params[1];

  if (!Array.isArray(array)) return null;
  return [...array, value];
};

/**
 *  Generator for the custom function push.
 *
 * @param _ Global options
 * @returns The custom function push
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => push;
