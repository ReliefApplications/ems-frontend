import { GlobalOptions } from '../types';

/**
 * Checks if value is in the array.
 *
 * @param params [array, value]
 * @returns if value is in the array or not
 */
const selected = (params: any[]) => {
  const [arr, value] = params;
  if (Array.isArray(arr)) {
    return arr.includes(value.toString());
  }
  return;
};

/**
 *  Generator for the custom function selected.
 *
 * @param _ Global options
 * @returns The custom function selected
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => selected;
