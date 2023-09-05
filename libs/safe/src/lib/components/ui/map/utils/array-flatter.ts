/**
 * Flatten an array
 *
 * @param {any[]} arr - any[] - the array to be flattened
 * @returns the array with all the nested arrays flattened.
 */
export const flatDeep = (arr: any[]): any[] =>
  arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val),
    []
  );
