import { GlobalOptions } from '../types';
/**
 * Formats date in specified format
 *
 * @param date Date
 * @param format Format, which can be either a locale string or a custom format
 */
function formatDate(params: any[]) {
  const [date, format] = params;
  const customFormatRegex = /^(DD|MM|YYYY)([-/])(DD|MM|YYYY)\2(DD|MM|YYYY)$/;
  const dateFormatted = new Date(date);
  const formatFormatted = format.toUpperCase();

  if (customFormatRegex.test(formatFormatted)) {
    const day = dateFormatted.getDate();
    const month = dateFormatted.getMonth() + 1;
    const year = dateFormatted.getFullYear();

    let formattedDate = formatFormatted
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('YYYY', year.toString());

    return formattedDate;
  } else {
    const locale = format; // Use the format as a locale string
    return new Intl.DateTimeFormat(locale).format(dateFormatted);
  }
}
// }
/**
 *  Generator for the custom function formatDate.
 * @param _ Global options
 * @returns The custom function formatDate
 */
export default (_: GlobalOptions) => formatDate;
