import { isEqual, isArray, get } from 'lodash';

/**
 * Calculate an operation for filters
 *
 * @param fieldValue The value which comes from the record item
 * @param operator The operator to use for the operation
 * @param filterValue The value which comes from the filter
 * @returns A boolean, indicating the result of the operation
 */
const operate = (
  fieldValue: any,
  operator: string,
  filterValue: any
): boolean => {
  switch (operator) {
    case 'eq':
      return isEqual(fieldValue, filterValue);
    case 'neq':
      return !isEqual(fieldValue, filterValue);
    case 'gte':
      return fieldValue >= filterValue;
    case 'gt':
      return fieldValue > filterValue;
    case 'lte':
      return fieldValue <= filterValue;
    case 'lt':
      return fieldValue < filterValue;
    case 'isnull':
      return fieldValue === null;
    case 'isnotnull':
      return fieldValue !== null;
    case 'isempty':
      return (
        fieldValue === null || (isArray(fieldValue) && fieldValue.length === 0)
      );
    case 'isnotempty':
      return isArray(fieldValue) && fieldValue.length > 0;
    case 'contains':
      if (fieldValue === null) return false;
      if (isArray(filterValue)) {
        for (const itemValue of filterValue) {
          if (!fieldValue.includes(itemValue)) {
            return false;
          }
        }
        return true;
      } else {
        return fieldValue.includes(filterValue);
      }
    case 'doesnotcontain':
      if (fieldValue === null) return true;
      if (isArray(filterValue)) {
        for (const itemValue of filterValue) {
          if (fieldValue.includes(itemValue)) {
            return false;
          }
        }
        return true;
      } else {
        return !fieldValue.includes(filterValue);
      }
    case 'startswith':
      return fieldValue.startsWith(filterValue);
    case 'endswith':
      return fieldValue.endsWith(filterValue);
    default:
      return true;
  }
};

/**
 * Test a record through a filter
 *
 * @param value The record to test
 * @param filter The filter to apply
 * @returns A boolean indicating if the record passes the filter
 */
export const applyFilters = (value: any, filter: any): boolean => {
  let res = false;
  let logic = false;

  if (filter.logic === 'and') {
    res = true;
    logic = true;
  }

  for (let i = 0; filter.filters[i] && res === logic; ++i) {
    if (filter.filters[i].logic) {
      res = applyFilters(value, filter.filters[i].filters);
    } else {
      res = operate(
        get(value, filter.filters[i].field, null),
        filter.filters[i].operator,
        filter.filters[i].value
      );
    }
  }
  return res;
};
