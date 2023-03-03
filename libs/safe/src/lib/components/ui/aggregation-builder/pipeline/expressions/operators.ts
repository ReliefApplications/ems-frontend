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

/**
 * Enum of available date operators, for field creation.
 */
export enum DateOperators {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
}

/**
 * Enum of available math operators, for field creation.
 */
export enum MathOperators {
  ADD = 'add',
  MULTIPLY = 'multiply',
}

/**
 * Enum of available default operators.
 */
export const DEFAULT_OPERATORS = {
  ...DateOperators,
  ...MathOperators,
};

/**
 * Array of operators which are not requiring any field selection.
 */
export const NO_FIELD_OPERATORS: string[] = [Accumulators.COUNT];
