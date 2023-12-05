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
  let res = [];

  switch (op) {
    case 'eq':
      res = arr.filter((item) => item[key] === value);

      console.log(res);
      return res;
    case 'neq':
      res = arr.filter((item) => item[key] !== value);

      console.log(res);
      return res;
    case 'gt':
      res = arr.filter((item) => item[key] > value);

      console.log(res);
      return res;
    case 'gte':
      res = arr.filter((item) => item[key] >= value);

      console.log(res);
      return res;
    case 'lt':
      res = arr.filter((item) => item[key] < value);

      console.log(res);
      return res;
    case 'lte':
      res = arr.filter((item) => item[key] <= value);

      console.log(res);
      return res;
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
