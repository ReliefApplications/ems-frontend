import { GlobalOptions } from '../types';

/**
 * Add days to a date
 *
 * @param params The date to add days to and the number of days to add.
 * @returns The new date.
 */
const addDays = (params: any[]) => {
  const result = new Date(params[0]);
  result.setDate(result.getDate() + Number(params[1]));
  return result;
};

/**
 *  Generator for the custom function addDays.
 *
 * @param _ Global options
 * @returns The custom function addDays
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => addDays;
