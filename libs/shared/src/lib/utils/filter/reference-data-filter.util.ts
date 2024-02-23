import { eq, get, isArray, isNil, isString } from 'lodash';

/**
 * Apply filter on item
 *
 * @param item Reference data item
 * @param filter filter
 * @returns is filter applied
 */
export const filterReferenceData = (item: any, filter: any) => {
  if (filter.logic && filter.filters) {
    const results = filter.filters.map((subFilter: any) =>
      filterReferenceData(item, subFilter)
    );
    return filter.logic === 'and'
      ? results.every(Boolean)
      : results.length
      ? results.some(Boolean)
      : true;
  } else {
    const value = get(item, filter.field);
    let intValue: number | null;
    try {
      intValue = Number(filter.value);
    } catch {
      intValue = null;
    }
    switch (filter.operator) {
      case 'eq':
        if (typeof filter.value === 'boolean') {
          return eq(value, String(filter.value)) || eq(value, filter.value);
        } else {
          return eq(value, String(filter.value)) || eq(value, intValue);
        }
      case 'ne':
      case 'neq':
        if (typeof filter.value === 'boolean') {
          return !(eq(value, String(filter.value)) || eq(value, filter.value));
        } else {
          return !(eq(value, String(filter.value)) || eq(value, intValue));
        }
      case 'gt':
        return !isNil(value) && value > filter.value;
      case 'gte':
        return !isNil(value) && value >= filter.value;
      case 'lt':
        return !isNil(value) && value < filter.value;
      case 'lte':
        return !isNil(value) && value <= filter.value;
      case 'isnull':
        return isNil(value);
      case 'isnotnull':
        return !isNil(value);
      case 'startswith':
        return !isNil(value) && value.startsWith(filter.value);
      case 'endswith':
        return !isNil(value) && value.endsWith(filter.value);
      case 'contains':
        if (isString(filter.value)) {
          const regex = new RegExp(filter.value, 'i');
          if (isString(value)) {
            return !isNil(value) && regex.test(value);
          } else {
            return !isNil(value) && value.includes(filter.value);
          }
        } else {
          return !isNil(value) && value.includes(filter.value);
        }
      case 'doesnotcontain':
        if (isString(filter.value)) {
          const regex = new RegExp(filter.value, 'i');
          if (isString(value)) {
            return isNil(value) || !regex.test(value);
          } else {
            return isNil(value) || !value.includes(filter.value);
          }
        } else {
          return isNil(value) || !value.includes(filter.value);
        }
      case 'in':
        if (isString(value)) {
          if (isArray(filter.value)) {
            return !isNil(filter.value) && filter.value.includes(value);
          } else {
            const regex = new RegExp(value, 'i');
            return !isNil(filter.value) && regex.test(filter.value);
          }
        } else {
          return !isNil(filter.value) && filter.value.includes(value);
        }
      case 'notint':
        if (isString(value)) {
          if (isArray(filter.value)) {
            return isNil(filter.value) || !filter.value.includes(value);
          } else {
            const regex = new RegExp(value, 'i');
            return isNil(filter.value) || !regex.test(filter.value);
          }
        } else {
          return isNil(filter.value) || !filter.value.includes(value);
        }
      default:
        return false;
    }
  }
};

export default filterReferenceData;
