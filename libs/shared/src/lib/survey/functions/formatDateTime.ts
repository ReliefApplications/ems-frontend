import { GlobalOptions } from '../types';

/** Interface for the allowed formats */
interface Formats {
  [key: string]: string | number;
}

/**
 * Formats datetime in specified format
 *
 * @param params The date time to format and the format to use.
 * @returns The formatted date time
 */
function formatDateTime(params: any[]) {
  const [dateTime, format] = params;
  const date = new Date(dateTime);

  // ensures that numbers are zero-padded where necessary
  const pad = (num: number, size: number) => {
    let s = String(num);
    while (s.length < size) s = '0' + s;
    return s;
  };

  const formats: Formats = {
    '%Y': date.getFullYear(),
    '%y': String(date.getFullYear()).slice(-2),
    '%m': pad(date.getMonth() + 1, 2),
    '%n': date.getMonth() + 1,
    '%b': [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][date.getMonth()],
    '%d': pad(date.getDate(), 2),
    '%e': date.getDate(),
    '%a': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
    '%H': pad(date.getHours(), 2),
    '%h': date.getHours(),
    '%M': pad(date.getMinutes(), 2),
    '%S': pad(date.getSeconds(), 2),
    '%3': pad(date.getMilliseconds(), 3),
  };

  let formattedDateTime = format;
  for (const key in formats) {
    // eslint-disable-next-line no-prototype-builtins
    if (formats.hasOwnProperty(key)) {
      formattedDateTime = formattedDateTime.replace(key, formats[key]);
    }
  }
  return formattedDateTime;
}

/**
 *  Generator for the custom function formatDateTime.
 *
 * @param _ Global options
 * @returns The custom function formatDateTime
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => formatDateTime;
