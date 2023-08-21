/**
 * Returns the length of an array.
 *
 * @param params params passed to the function
 * @returns The length of the array.
 */
const length = (params: any[]) => {
  if (!Array.isArray(params[0])) return 0;
  return params[0].length;
};

export default length;
