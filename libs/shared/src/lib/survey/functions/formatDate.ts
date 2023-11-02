import { GlobalOptions } from '../types';
import * as Survey from 'survey-angular';

/**
 * Formats date in specified format
 *
 * @param params The date to format and the format to use.
 * @returns The formatted date.
 */
function formatDate(params: any[]) {
  const [date, format = Survey.surveyLocalization.defaultLocaleValue] = params;
  const customFormatRegex = /^(DD|MM|YYYY)([-/])(DD|MM|YYYY)\2(DD|MM|YYYY)$/;
  const dateFormatted = new Date(date);
  const formatFormatted = format.toUpperCase();

  if (customFormatRegex.test(formatFormatted)) {
    const day = dateFormatted.getDate();
    const month = dateFormatted.getMonth() + 1;
    const year = dateFormatted.getFullYear();

    const formattedDate = formatFormatted
      .replace('DD', day.toString().padStart(2, '0'))
      .replace('MM', month.toString().padStart(2, '0'))
      .replace('YYYY', year.toString());

    return formattedDate;
  } else {
    const currentLocaleKeys = Object.keys(
      Survey.surveyLocalization.localeNames
    ); // Use the format as a locale string
    if (currentLocaleKeys.includes(format.toLowerCase())) {
      return new Intl.DateTimeFormat(format).format(dateFormatted);
    } else {
      return new Intl.DateTimeFormat(
        Survey.surveyLocalization.defaultLocaleValue
      ).format(dateFormatted);
    }
  }
}
// }
/**
 *  Generator for the custom function formatDate.
 *
 * @param _ Global options
 * @returns The custom function formatDate
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => formatDate;
