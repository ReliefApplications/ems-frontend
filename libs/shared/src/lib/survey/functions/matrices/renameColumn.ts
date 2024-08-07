import { isNil } from 'lodash';
import { GlobalOptions } from '../../types';

/**
 * Custom function to rename a column of a matrix
 *
 * @param params [matrix, columnName, newName]
 * @returns The new matrix with the column renamed
 */
const renameColumn = (params: any[]) => {
  const [matrix, colName, newName] = params;

  if (
    isNil(matrix) ||
    typeof matrix !== 'object' ||
    typeof colName !== 'string' ||
    typeof newName !== 'string'
  ) {
    return null;
  }

  const objCpy = { ...matrix };

  Object.keys(matrix).forEach((key) => {
    objCpy[key] = { ...objCpy[key], [newName]: objCpy[key][colName] };
    delete objCpy[key][colName];
  });

  return objCpy;
};

/**
 *  Generator for the custom function renameColumn.
 *
 * @param _ Global options
 * @returns The custom function renameColumn
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => renameColumn;
