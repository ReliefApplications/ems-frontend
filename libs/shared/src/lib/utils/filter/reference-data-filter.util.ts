import { eq, get, isNil } from 'lodash';

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
      : results.some(Boolean);
  } else {
    const value = get(item, filter.field);
    switch (filter.operator) {
      case 'eq':
        return eq(value, filter.value);
      case 'ne':
      case 'neq':
        return !eq(value, filter.value);
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
        return !isNil(value) && value.includes(filter.value);
      case 'doesnotcontain':
        return isNil(value) || !value.includes(filter.value);
      default:
        return true;
    }
  }
};

export default filterReferenceData;
