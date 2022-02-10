/**
 * Check against a regex to see if the passed string can be a mongo ID.
 *
 * @param value String to check.
 * @return Boolean indicating if the passed string is a mongo ID.
 */
export const isMongoId = (value: string): boolean =>
  Boolean(value.match(/^[0-9a-fA-F]{24}$/));
