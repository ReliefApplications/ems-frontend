import { GlobalOptions } from '../types';

/**
 * Replace a substring in a string with another substring.
 *
 * @param params [string, searchValue, replaceValue, regexFlag]
 * @returns The replaced string or an empty string
 */
const replace = (params: any[]) => {
  const [str, searchValue, replaceValue] = params;

  if (
    !str ||
    !searchValue ||
    !replaceValue ||
    typeof str !== 'string' ||
    typeof searchValue !== 'string' ||
    typeof replaceValue !== 'string'
  ) {
    return '';
  }

  return str.replace(searchValue, replaceValue);
};

/**
 *  Generator for the custom function replace.
 *
 * @param _ Global options
 * @returns The custom function replace
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => replace;
