import { GlobalOptions } from '../types';

/**
 * Adds time to a certain date
 *
 * @param params the date, the number of units and the unit
 * @returns the new date
 */
const addTime = (params: any[]) => {
  const [dateStr, num, paramUnit, dateOnly = false] = params;
  const unit = paramUnit?.toLowerCase() || 'days';
  if (!dateStr) {
    return null;
  }
  if (!num) {
    return dateStr;
  }

  const date = new Date(dateStr);

  switch (unit) {
    case 'days':
      date.setDate(date.getDate() + num);
      break;
    case 'weeks':
      date.setDate(date.getDate() + num * 7);
      break;
    case 'months':
      date.setMonth(date.getMonth() + num);
      break;
    case 'years':
      date.setFullYear(date.getFullYear() + num);
      break;
    default:
      break;
  }

  return dateOnly
    ? `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${
        date.getDate() + 1
      }`.padStart(2, '0')}`
    : date;
};

/**
 *  Generator for the custom function addTime.
 *
 * @param _ Global options
 * @returns The custom function addTime
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => addTime;
