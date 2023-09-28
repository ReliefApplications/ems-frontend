import { GlobalOptions } from '../types';

/**
 * Replaces newlines with <br> tags of the given string.
 *
 * @param params The string to replace newlines with <br> tags.
 * @returns The string with newlines replaced with <br> tags.
 */
const nl2br = (params: any[]) => {
  if (!params[0]) return '';
  return params[0].replace(/\n/g, '<br>');
};

/**
 *  Generator for the custom function nl2br.
 *
 * @param _ Global options
 * @returns The custom function nl2br
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => nl2br;
