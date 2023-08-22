/**
 * Replaces newlines with <br> tags of the given string.
 *
 * @param params The string to replace newlines with <br> tags.
 * @returns The string with newlines replaced with <br> tags.
 */
export default (params: any[]) => {
  if (!params[0]) return '';
  return params[0].replace(/\n/g, '<br>');
};
