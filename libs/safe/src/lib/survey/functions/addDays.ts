/**
 * Add days to a date
 *
 * @param params The date to add days to and the number of days to add.
 * @returns The new date.
 */
export default (params: any[]) => {
  const result = new Date(params[0]);
  result.setDate(result.getDate() + Number(params[1]));
  return result;
};
