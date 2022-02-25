/**
 * Enum of available accumulators, for field creation.
 */
export enum Accumulators {
  SUM = 'sum',
  AVG = 'avg',
  COUNT = 'count',
  MAX = 'max',
  MIN = 'min',
  FIRST = 'first',
  LAST = 'last',
}

export enum DefaultOperators {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
  ADD = 'add',
  MULTIPLY = 'multiply',
}

export const NO_FIELD_OPERATORS: string[] = [Accumulators.COUNT];
