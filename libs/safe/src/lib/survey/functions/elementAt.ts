/**
 * Returns the element at the specified index in the array.
 *
 * @param params Array of parameters (array, index)
 * @returns Element at the specified index in the array
 */
export default (params: any[]) => {
  const array = params[0];
  const index = params[1];
  if (!Array.isArray(array)) return null;
  if (isNaN(Number(index))) return null;
  return array[index] ?? null;
};
