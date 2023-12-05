import { GlobalOptions } from '../types';

/**
 * Registration of new custom functions for the survey.
 *
 * @param params list of numbers to sum
 * @returns the sum of the numbers
 */
function sum(params: any[]) {
  const [arr] = params;

  if (!Array.isArray(arr)) {
    return 0;
  }

  let sum = 0;
  arr.forEach((item) => {
    if (typeof item === 'number') {
      sum += item;
    }
  });

  return sum;
}

/**
 *  Generator for the custom function sum.
 *
 * @param _ Global options
 * @returns The custom function sum
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => sum;
