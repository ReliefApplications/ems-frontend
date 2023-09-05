import { GlobalOptions } from '../types';

/**
 * Gets the current day of the week, 0-6 for a given date.
 *
 * @param params The date to get the day of the week from.
 * @returns The day of the week, 0-6.
 */
const weekday = (params: Date[]) => new Date(params[0]).getDay();

/**
 *  Generator for the custom function weekday.
 *
 * @param _ Global options
 * @returns The custom function weekday
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => weekday;
