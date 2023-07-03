/**
 * Returns the type of the input value as a string.
 *
 * @param value The input value to check.
 * @returns The type of the input value as a string.
 */
export const inferTypeFromString = (
  value: string
):
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null'
  | 'undefined' => {
  if (value === null) {
    return 'null';
  } else if (value === undefined) {
    return 'undefined';
  } else {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return 'array';
      } else if (typeof parsed === 'object' && parsed !== null) {
        return 'object';
      } else {
        const jsType = typeof parsed;
        switch (jsType) {
          case 'boolean':
            return 'boolean';

          case 'number':
          case 'bigint':
            return 'number';

          default:
            return 'string';
        }
      }
    } catch (error) {
      return 'string';
    }
  }
};
