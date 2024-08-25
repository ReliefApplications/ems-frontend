import { get } from 'lodash';
import { GlobalOptions } from '../types';

/**
 * Returns the value of the field from the dynamic panel, in iteration index
 *
 * @param params Array of parameters (field, array, index)
 * @returns Value of the field at the specified index in the array
 */
function indexedRepeat(params: any[]) {
  const [field, arr, index] = params;
  if (arr && Array.isArray(arr)) {
    const panel = arr[index];
    return get(panel, field, null);
  }
  return null;
}

/**
 *  Generator for the custom function indexedRepeat.
 *
 * @param _ Global options
 * @returns The custom function indexedRepeat
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => indexedRepeat;
