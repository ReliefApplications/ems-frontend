/** Suffix for all keys */
const SUFFIX = '}}';
/** Prefix for all keys */
const PREFIX = '{{';

/**
 * Returns an array with the keys for data autocompletion.
 *
 * @param fields Array of fields.
 * @returns list of data keys
 */
export const getDataKeys = (fields: any): string[] =>
  Object.keys(fields[0]).map((field: any) => PREFIX + field + SUFFIX);
