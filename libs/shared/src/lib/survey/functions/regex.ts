import { GlobalOptions } from '../types';

/**
 * Replace a substring in a string with another substring.
 *
 * @param params [string, searchValue, replaceValue, regexFlag]
 * @returns The replaced string or an empty string
 */
const regexReplace = (params: any[]) => {
  const [str, expression] = params;

  if (typeof str !== 'string' || typeof expression !== 'string') {
    return '';
  }
  const regex = new RegExp(expression);
  return regex.test(str);
};

/**
 *  Generator for the custom function replace.
 *
 * @param _ Global options
 * @returns The custom function replace
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => regexReplace;
