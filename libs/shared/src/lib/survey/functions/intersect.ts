import { isEqual } from 'lodash';
import { GlobalOptions } from '../types';

/**
 * Custom function that gets two arrays and returns the intersection of them.
 *
 * @param params params passed to the function
 * @returns The intersection of the two arrays.
 */
const intersect = (params: any[]) => {
  if (!Array.isArray(params[0]) || !Array.isArray(params[1])) return [];
  return params[0].filter((value) =>
    params[1].find((v: any) => isEqual(v, value))
  );
};

/**
 *  Generator for the custom function intersect.
 *
 * @param _ Global options
 * @returns The custom function intersect
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => intersect;
