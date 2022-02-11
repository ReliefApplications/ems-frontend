const operate = (field: any, operator: string, value: any): boolean => {
  switch (operator) {
    case 'eq':
      return field === value;
    case 'neq':
      return field !== value;
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
      return field.lenght === 0;
    case 'isnotempty':
      return field.lenght > 0;
    case 'contains':
      return field.includes(value);
    case 'doesnotcontain':
      return !field.includes(value);
    case 'startswith':
      return field.startsWith(value);
    case 'endswith':
      return field.endsWith(value);
    default:
      return true;
  }
};

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
