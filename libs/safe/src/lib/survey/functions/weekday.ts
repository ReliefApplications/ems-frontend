/**
 * Gets the current day of the week, 0-6 for a given date.
 *
 * @param params The date to get the day of the week from.
 * @returns The day of the week, 0-6.
 */
export default (params: Date[]) => new Date(params[0]).getDay();
