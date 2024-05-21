import { GlobalOptions } from '../types';

/**
 * Returns the today date in YYYY-MM-DD
 *
 * @returns The date string
 */
export const todayDate = () => {
  const padded = (num: number) => num.toString().padStart(2, '0');
  const now = new Date();

  return `${now.getFullYear()}-${padded(now.getMonth() + 1)}-${padded(
    now.getDate()
  )}`;
};

/**
 *  Generator for the custom function todayDate.
 *
 * @param _ Global options
 * @returns The custom function todayDate
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => todayDate;
