export const FILTER_OPERATORS = [
  {
    value: 'eq',
    label: 'kendo.grid.filterEqOperator',
  },
  {
    value: 'neq',
    label: 'kendo.grid.filterNotEqOperator',
  },
  {
    value: 'gte',
    label: 'kendo.grid.filterGteOperator',
  },
  {
    value: 'gt',
    label: 'kendo.grid.filterGtOperator',
  },
  {
    value: 'lte',
    label: 'kendo.grid.filterLteOperator',
  },
  {
    value: 'lt',
    label: 'kendo.grid.filterLtOperator',
  },
  {
    value: 'isnull',
    label: 'kendo.grid.filterIsNullOperator',
    disableValue: true,
  },
  {
    value: 'isnotnull',
    label: 'kendo.grid.filterIsNotNullOperator',
    disableValue: true,
  },
  {
    value: 'isempty',
    label: 'kendo.grid.filterIsEmptyOperator',
    disableValue: true,
  },
  {
    value: 'isnotempty',
    label: 'kendo.grid.filterIsNotEmptyOperator',
    disableValue: true,
  },
  {
    value: 'contains',
    label: 'kendo.grid.filterContainsOperator',
  },
  {
    value: 'doesnotcontain',
    label: 'kendo.grid.filterNotContainsOperator',
  },
  {
    value: 'startswith',
    label: 'kendo.grid.filterStartsWithOperator',
  },
  {
    value: 'endswith',
    label: 'kendo.grid.filterEndsWithOperator',
  },
];

export const FIELD_TYPES = [
  {
    editor: 'text',
    defaultOperator: 'eq',
    operators: [
      'eq',
      'neq',
      'contains',
      'doesnotcontain',
      'startswith',
      'endswith',
      'isnull',
      'isnotnull',
      'isempty',
      'isnotempty',
    ],
  },
  {
    editor: 'time',
    defaultOperator: 'eq',
    operators: [
      'eq',
      'neq',
      'contains',
      'doesnotcontain',
      'startswith',
      'endswith',
      'isnull',
      'isnotnull',
      'isempty',
      'isnotempty',
    ],
  },
  {
    editor: 'boolean',
    defaultOperator: 'eq',
    operators: ['eq', 'neq'],
  },
  {
    editor: 'numeric',
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull'],
  },
  {
    editor: 'select',
    defaultOperator: 'contains',
    operators: [
      'eq',
      'neq',
      'contains',
      'doesnotcontain',
      'isempty',
      'isnotempty',
    ],
  },
  {
    editor: 'date',
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull'],
  },
  {
    editor: 'datetime',
    defaultOperator: 'eq',
    operators: ['eq', 'neq', 'gte', 'gt', 'lte', 'lt', 'isnull', 'isnotnull'],
  },
];
