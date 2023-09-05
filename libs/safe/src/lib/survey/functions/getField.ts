import { GlobalOptions } from '../types';

/**
 * Get field from object
 *
 * @param params Array of parameters (object, field)
 * @returns Field value or null
 */
const getField = (params: any[]) => {
  const object = params[0];
  const field = params[1];

  if (!object || typeof object !== 'object' || Array.isArray(object))
    return null;
  if (!field) return null;

  return object[field] ?? null;
};

/**
 *  Generator for the custom function getField.
 *
 * @param _ Global options
 * @returns The custom function getField
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getField;
