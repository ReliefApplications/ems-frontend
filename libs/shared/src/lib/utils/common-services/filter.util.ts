import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';

/**
 * Transforms a filter descriptor into a format suitable for common services backend processing.
 *
 * @param filter Filter descriptor, which can be either a composite filter or a simple filter.
 * @returns An object representing the filter for the common services backend or null if the filter is not valid.
 */
const getFilter = (
  filter: CompositeFilterDescriptor | FilterDescriptor
): Record<string, any> | null => {
  if ('filters' in filter) {
    // Composite filter
    switch (filter.logic) {
      case 'and': {
        return {
          AND: filter.filters
            .map((subFilter: any) => getFilter(subFilter))
            .filter((f) => f !== null),
        };
      }
      case 'or': {
        return {
          OR: filter.filters
            .map((subFilter: any) => getFilter(subFilter))
            .filter((f) => f !== null),
        };
      }
    }
  } else {
    // Simple filter
    switch (filter.operator) {
      case 'in': {
        return { [`${filter.field}_in`]: filter.value };
      }
      case 'notin': {
        return { [`${filter.field}_nin`]: filter.value };
      }
      case 'isempty': {
        return { [`${filter.field}_eq`]: null };
      }
      case 'isnotempty': {
        return { [`${filter.field}_neq`]: null };
      }
      default: {
        return null;
      }
    }
  }
};

export default getFilter;
