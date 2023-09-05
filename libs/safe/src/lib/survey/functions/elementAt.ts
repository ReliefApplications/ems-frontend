import { GlobalOptions } from '../types';

/**
 * Returns the element at the specified index in the array.
 *
 * @param params Array of parameters (array, index)
 * @returns Element at the specified index in the array
 */
const elementAt = (params: any[]) => {
  const array = params[0];
  const index = params[1];
  if (!Array.isArray(array)) return null;
  if (isNaN(Number(index))) return null;
  return array[index] ?? null;
};

/**
 *  Generator for the custom function elementAt.
 *
 * @param _ Global options
 * @returns The custom function elementAt
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => elementAt;
