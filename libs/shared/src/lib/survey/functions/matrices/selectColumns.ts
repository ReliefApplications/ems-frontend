import { isNil } from 'lodash';
import { GlobalOptions } from '../../types';

/**
 * Custom function that gets a matrix object and returns a new one with only the columns specified.
 *
 * @param params [matrix, list of columns to keep]
 * @returns The new matrix with the columns specified
 */
const selectColumns = (params: any[]) => {
  const [matrix, colsToKeep] = params;

  if (
    isNil(matrix) ||
    typeof matrix !== 'object' ||
    !Array.isArray(colsToKeep)
  ) {
    return null;
  }

  const objCpy = { ...matrix };

  Object.keys(matrix).forEach((key) => {
    const cols = Object.keys(objCpy[key]);
    cols.forEach((col) => {
      if (!colsToKeep.includes(col)) {
        delete objCpy[key][col];
      }
    });
  });
  return objCpy;
};

/**
 *  Generator for the custom function selectColumns.
 *
 * @param _ Global options
 * @returns The custom function selectColumns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => selectColumns;
