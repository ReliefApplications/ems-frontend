import { GlobalOptions } from '../types';

/**
 * Joins the members of array, using the string separator.
 *
 * @param params The array and the separator to use.
 * @returns the string from the join operation
 */
function join(params: any[]) {
  const [separator, arr] = params;
  if (!Array.isArray(arr)) {
    return '';
  }

  return arr.join(separator);
}

/**
 *  Generator for the custom function join.
 *
 * @param _ Global options
 * @returns The custom function join
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => join;
