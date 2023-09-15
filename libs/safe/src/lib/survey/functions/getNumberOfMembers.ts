import { GlobalOptions } from '../types';

/**
 * Returns the number of members of an array.
 *
 * @param params params passed to the function
 * @returns The length of the array.
 */
const getNumberOfMembers = (params: any[]) => {
  if (!Array.isArray(params[0])) return 0;
  else {
    let total = 0;
    params[0].forEach(key => {
      Object.values(key).forEach(memberCount => {
        if (typeof memberCount === 'object' && memberCount !== null) {
          total += Object.values(memberCount).reduce((acc, count) => acc + count, 0);
        }
      });
    });
    return total;
  }
};

/**
 *  Generator for the custom function length.
 *
 * @param _ Global options
 * @returns The custom function length
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getNumberOfMembers;
