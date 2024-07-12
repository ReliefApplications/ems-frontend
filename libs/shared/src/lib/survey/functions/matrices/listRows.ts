import { isNil } from 'lodash';
import { GlobalOptions } from '../../types';

/**
 * Custom function to return a list with the rows of a matrix
 *
 * @param params [matrix]
 * @returns A list with the rows of the matrix
 */
const listRows = (params: any[]) => {
  const [matrix] = params;

  if (isNil(matrix) || typeof matrix !== 'object') {
    return null;
  }

  return Object.keys(matrix);
};

/**
 *  Generator for the custom function listRows.
 *
 * @param _ Global options
 * @returns The custom function listRows
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => listRows;
