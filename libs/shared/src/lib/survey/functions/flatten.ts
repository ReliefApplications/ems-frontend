import { flatten as lodash_flatten } from 'lodash';
import { GlobalOptions } from '../types';

/**
 * Flattens an array
 *
 * @param params The nested array to flatten
 * @returns The new array.
 */
const flatten = (params: any[]) => {
  const array = params[0];

  if (!Array.isArray(array)) {
    return null;
  }
  return lodash_flatten(array);
};

/**
 *  Generator for the custom function flatten.
 *
 * @param _ Global options
 * @returns The custom function flatten
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => flatten;
