import { isEqual, isArray } from 'lodash';

/**
 * Calculate an operation for filters
 *
 * @param field The value which comes from the record item
 * @param operator The operator to use for the operation
 * @param value The value which comes from the filter
 * @returns A boolean, indicating the result of the operation
 */
const operate = (field: any, operator: string, value: any): boolean => {
  switch (operator) {
    case 'eq':
      return isEqual(field, value);
    case 'neq':
      return !isEqual(field, value);
    case 'gte':
      return field >= value;
    case 'gt':
      return field > value;
    case 'lte':
      return field <= value;
    case 'lt':
      return field < value;
    case 'isnull':
      return field === null;
    case 'isnotnull':
      return field !== null;
    case 'isempty':
      return field === null || (isArray(field) && field.length === 0);
    case 'isnotempty':
      return isArray(field) && field.length > 0;
    case 'contains':
      if (field === null) return false;
      if (isArray(value)) {
        for (const itemValue of value) {
          if (!field.includes(itemValue)) {
            return false;
          }
        }
        return true;
      } else {
        return field.includes(value);
      }
    case 'doesnotcontain':
      if (field === null) return true;
      if (isArray(value)) {
        for (const itemValue of value) {
          if (field.includes(itemValue)) {
            return false;
          }
        }
        return true;
      } else {
        return !field.includes(value);
      }
    case 'startswith':
      return field.startsWith(value);
    case 'endswith':
      return field.endsWith(value);
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
        value[filter.filters[i].field],
        filter.filters[i].operator,
        filter.filters[i].value
      );
    }
  }
  return res;
};
