/**
 * Checks that two arrays contain exactly the same items.
 *
 * @param itemValue Array value of the item
 * @param filterValue Array value of the filter
 * @returns the two arrays contain exactly the same items.
 */
export const equals = (itemValue: any, filterValue: any): boolean =>
  contains(itemValue, filterValue) && contains(filterValue, itemValue);

/**
 * Checks that two arrays does not contain exactly the same items.
 *
 * @param itemValue Array value of the item
 * @param filterValue Array value of the filter
 * @returns the two arrays does not contain exactly the same items.
 */
export const notEquals = (itemValue: any, filterValue: any): boolean =>
  !equals(itemValue, filterValue);

/**
 * Checks that the first array contains the second one.
 *
 * @param itemValue Array value of the item
 * @param filterValue Array value of the filter
 * @returns first array contains second array value.
 */
export const contains = (itemValue: any, filterValue: any): boolean =>
  filterValue?.every((i: any) => itemValue?.includes(i));

/**
 * Checks that the first array does not contain exactly the second one.
 *
 * @param itemValue Array value of the item
 * @param filterValue Array value of the filter
 * @returns first array does not contain exactly the second one.
 */
export const notContains = (itemValue: any, filterValue: any): boolean =>
  !filterValue?.some((i: any) => itemValue?.includes(i));

/**
 * Flatten an array
 *
 * @param {any[]} arr - any[] - the array to be flattened
 * @returns the array with all the nested arrays flattened.
 */
export const flatDeep = (arr: any[]): any[] => {
  return arr.reduce(
    (acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val),
    []
  );
};
