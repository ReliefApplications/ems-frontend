import { cloneDeep, isEqual, isNil } from 'lodash';
import { GlobalOptions } from '../../types';

/**
 * Custom function to return only the rows that meet a certain condition.
 *
 * @param params [matrix, columnName, value, operator = '==']
 * @returns An object with the rows that meet the condition
 */
const filterRowsByColValue = (params: any[]) => {
  const [matrix, columnName, value, operator] = params;

  if (
    isNil(matrix) ||
    typeof matrix !== 'object' ||
    typeof columnName !== 'string'
  ) {
    return null;
  }

  const operatorMap = {
    eq: isEqual,
    ne: (a: any, b: any) => !isEqual(a, b),
    gt: (a: any, b: any) => a > b,
    lt: (a: any, b: any) => a < b,
    gte: (a: any, b: any) => a >= b,
    lte: (a: any, b: any) => a <= b,
    in: (a: any, b: any[]) => b.includes(a),
    nin: (a: any, b: any[]) => !b.includes(a),
    contains: (a: any, b: any[]) => b.includes(a),
    doesnotcontain: (a: any, b: any[]) => !b.includes(a),
  };

  const operatorFn =
    operatorMap[operator as keyof typeof operatorMap] || isEqual;

  const objCpy = cloneDeep(matrix);

  Object.keys(matrix).forEach((key) => {
    if (!operatorFn(matrix[key][columnName], value)) {
      delete objCpy[key];
    }
  });

  return objCpy;
};

/**
 *  Generator for the custom function filterRowsByColValue.
 *
 * @param _ Global options
 * @returns The custom function filterRowsByColValue
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => filterRowsByColValue;
