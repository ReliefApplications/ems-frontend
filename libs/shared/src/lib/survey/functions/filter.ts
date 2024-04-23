import { GlobalOptions } from '../types';

/**
 * Filters an array of objects by a given key and value.
 *
 * @param params The array of objects, the key and the value to filter by.
 * @returns The filtered array.
 */
const filter = (params: any[]) => {
  const [arr, key, value, opParam] = params;

  // Validate the parameters
  const validOps = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte'];
  if (!Array.isArray(arr) || typeof key !== 'string') {
    return [];
  }

  // Default operation is 'eq'
  const op = opParam || 'eq';
  if (!validOps.includes(op)) {
    return [];
  }

  switch (op) {
    case 'eq':
      return arr.filter((item) => item[key] === value);
    case 'neq':
      return arr.filter((item) => item[key] !== value);
    case 'gt':
      return arr.filter((item) => item[key] > value);
    case 'gte':
      return arr.filter((item) => item[key] >= value);
    case 'lt':
      return arr.filter((item) => item[key] < value);
    case 'lte':
      return arr.filter((item) => item[key] <= value);
    default:
      return arr;
  }
};

/**
 *  Generator for the custom function filter.
 *
 * @param _ Global options
 * @returns The custom function filter
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => filter;
