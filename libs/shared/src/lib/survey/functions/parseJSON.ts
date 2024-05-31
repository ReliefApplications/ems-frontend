import { GlobalOptions } from '../types';

/**
 * Get field from object
 *
 * @param params Array of parameters (stringified object)
 * @returns Parsed object or null if fail to parse
 */
const parseJSON = (params: any[]) => {
  const stringifiedObj = params[0];

  try {
    const obj = JSON.parse(stringifiedObj);
    return obj;
  } catch {
    return null;
  }
};

/**
 *  Generator for the custom function parseJSON.
 *
 * @param _ Global options
 * @returns The custom function parseJSON
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => parseJSON;
