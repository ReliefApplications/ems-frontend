import { GlobalOptions } from '../types';

/**
 * Returns the total number of members in family
 *
 * @param params params passed to the function
 * @returns The total of family members.
 */
const getNumberOfMembers = (params: any[]) => {
  const obj = params[0];
  if (typeof obj !== 'object') return 0;
  else {
    let total = 0;
    Object.values(obj).forEach((row) => {
      if (typeof row === 'object' && row !== null) {
        Object.values(row).forEach((col) => {
          if (typeof col === 'number') {
            total += col;
          }
        });
      }
    });

    return total;
  }
};

/**
 *  Generator for the custom function total.
 *
 * @param _ Global options
 * @returns The custom function total
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getNumberOfMembers;
