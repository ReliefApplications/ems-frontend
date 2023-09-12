/**
 * Returns the filters formatted to accommodate the searched string
 *
 * @param search Searched string
 * @param fields List of available fields
 * @param skippedFields List of fields to skip
 * @returns Formatted filter object
 */
export const searchFilters = (
  search: string,
  fields: any[],
  skippedFields: any[] = []
): any => {
  const filters: {
    field: string;
    operator: string;
    value: string | number | boolean | Array<any> | Date;
  }[] = [];

  fields.forEach((field) => {
    if (!field || skippedFields.includes(field.name)) return;

    // string
    if (
      [
        'text',
        'color',
        'email',
        'tel',
        'url',
        'comment',
        'radiogroup',
        'dropdown',
      ].includes(field?.type)
    )
      filters.push({
        field: field.name,
        operator: 'contains',
        value: search,
      });

    // number
    if (
      (field?.type === 'numeric' || field?.name === 'range') &&
      !isNaN(parseFloat(search))
    )
      filters.push({
        field: field.name,
        operator: 'eq',
        value: parseFloat(search),
      });

    // boolean
    if (field?.type === 'boolean') {
      try {
        filters.push({
          field: field.name,
          operator: 'eq',
          value: Boolean(JSON.parse(search)), // allows numerical and textual search (1 / true)
        });
      } catch {
        // cannot be parsed to JSON
      }
    }

    // array
    if (['checkbox', 'tagbox'].includes(field?.type)) {
      filters.push({
        field: field.name,
        operator: 'contains',
        value: [search],
      });
    }

    // date
    if (['date', 'datetime', 'datetime-local'].includes(field?.type)) {
      filters.push({
        field: field.name,
        operator: 'eq',
        value: search,
      });
    }
  });

  return filters;
};

export default searchFilters;
