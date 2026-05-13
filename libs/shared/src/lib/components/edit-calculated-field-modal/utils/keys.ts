/** Prefix for data keys */
const DATA_PREFIX = '{{data.';
/** Prefix for calc keys */
const CALC_PREFIX = '{{calc.';
/** Prefix for info keys */
const INFO_PREFIX = '{{info.';
/** Prefix for user contextual keys */
const USER_PREFIX = '{{user.';
/** Suffix for all keys */
const PLACEHOLDER_SUFFIX = '}}';

type UserAttribute = string | { value: string; text?: string };

/** Category buckets used to group calc functions in the reference panel. */
export type CalcFunctionCategory =
  | 'math'
  | 'logic'
  | 'comparison'
  | 'date'
  | 'string'
  | 'array'
  | 'conversion'
  | 'misc';

/** Static metadata describing a calc function for the reference panel. */
export interface CalcFunctionMeta {
  /** Function name as used in the expression. */
  name: string;
  /** Human readable signature, e.g. `add( value1 ; value2 ; ... )`. */
  signature: string;
  /** Short description of what the function does. */
  description: string;
  /** Optional usage example. */
  example?: string;
  /** Grouping category. */
  category: CalcFunctionCategory;
}

/**
 * Metadata for every calc function supported in calculated-field expressions.
 * `getCalcKeys()` derives the autocompleter list from this same array, so
 * adding an entry here exposes the function in both the editor and the
 * reference modal.
 */
export const CALC_FUNCTIONS_META: CalcFunctionMeta[] = [
  // Math
  {
    name: 'add',
    signature: 'add( value1 ; value2 ; ... )',
    description: 'Sum of all arguments.',
    category: 'math',
  },
  {
    name: 'sub',
    signature: 'sub( value1 ; value2 )',
    description: 'Subtracts value2 from value1.',
    category: 'math',
  },
  {
    name: 'mul',
    signature: 'mul( value1 ; value2 ; ... )',
    description: 'Product of all arguments.',
    category: 'math',
  },
  {
    name: 'div',
    signature: 'div( value1 ; value2 )',
    description: 'Divides value1 by value2.',
    category: 'math',
  },

  // Logic
  {
    name: 'and',
    signature: 'and( value1 ; value2 ; ... )',
    description: 'Logical AND of all arguments.',
    category: 'logic',
  },
  {
    name: 'or',
    signature: 'or( value1 ; value2 ; ... )',
    description: 'Logical OR of all arguments.',
    category: 'logic',
  },
  {
    name: 'if',
    signature: 'if( condition ; then ; else )',
    description: 'Returns `then` when `condition` is truthy, `else` otherwise.',
    category: 'logic',
  },

  // Comparison
  {
    name: 'eq',
    signature: 'eq( value1 ; value2 )',
    description: 'True when value1 equals value2.',
    category: 'comparison',
  },
  {
    name: 'ne',
    signature: 'ne( value1 ; value2 )',
    description: 'True when value1 differs from value2.',
    category: 'comparison',
  },
  {
    name: 'gt',
    signature: 'gt( value1 ; value2 )',
    description: 'True when value1 is strictly greater than value2.',
    category: 'comparison',
  },
  {
    name: 'gte',
    signature: 'gte( value1 ; value2 )',
    description: 'True when value1 is greater than or equal to value2.',
    category: 'comparison',
  },
  {
    name: 'lt',
    signature: 'lt( value1 ; value2 )',
    description: 'True when value1 is strictly less than value2.',
    category: 'comparison',
  },
  {
    name: 'lte',
    signature: 'lte( value1 ; value2 )',
    description: 'True when value1 is less than or equal to value2.',
    category: 'comparison',
  },

  // Date
  {
    name: 'today',
    signature: 'today( offset )',
    description:
      "Today's date, optionally shifted by `offset` days (positive or negative).",
    category: 'date',
  },
  {
    name: 'date',
    signature: 'date( value )',
    description: 'Parses `value` into a date.',
    category: 'date',
  },
  {
    name: 'datediff',
    signature: 'datediff( date1 ; date2 )',
    description: 'Number of days between date1 and date2.',
    category: 'date',
  },
  {
    name: 'year',
    signature: 'year( date )',
    description: 'Year component of the given date.',
    category: 'date',
  },
  {
    name: 'month',
    signature: 'month( date )',
    description: 'Month component of the given date.',
    category: 'date',
  },
  {
    name: 'day',
    signature: 'day( date )',
    description: 'Day-of-month component of the given date.',
    category: 'date',
  },
  {
    name: 'hour',
    signature: 'hour( date )',
    description: 'Hour component of the given date.',
    category: 'date',
  },
  {
    name: 'minute',
    signature: 'minute( date )',
    description: 'Minute component of the given date.',
    category: 'date',
  },
  {
    name: 'second',
    signature: 'second( date )',
    description: 'Second component of the given date.',
    category: 'date',
  },
  {
    name: 'millisecond',
    signature: 'millisecond( date )',
    description: 'Millisecond component of the given date.',
    category: 'date',
  },

  // String
  {
    name: 'concat',
    signature: 'concat( value1 ; value2 ; ... )',
    description: 'Concatenates all arguments as strings.',
    category: 'string',
  },
  {
    name: 'substr',
    signature: 'substr( value ; startIndex ; length )',
    description:
      'Substring of `value` starting at `startIndex` for `length` characters.',
    category: 'string',
  },

  // Array
  {
    name: 'size',
    signature: 'size( value )',
    description: 'Number of items in an array (or characters in a string).',
    category: 'array',
  },
  {
    name: 'includes',
    signature: 'includes( array ; element )',
    description: 'True when `array` contains `element`.',
    category: 'array',
  },

  // Conversion
  {
    name: 'toInt',
    signature: 'toInt( value )',
    description: 'Converts `value` to an integer.',
    category: 'conversion',
  },
  {
    name: 'toLong',
    signature: 'toLong( value )',
    description: 'Converts `value` to a long integer.',
    category: 'conversion',
  },

  // Misc
  {
    name: 'exists',
    signature: 'exists( value )',
    description: 'True when `value` is not null or undefined.',
    category: 'misc',
  },
  {
    name: 'displayValue',
    signature: "displayValue( 'name' )",
    description:
      'Returns the display value (choice text) of the field with the given name on the current record.',
    example: "{{calc.displayValue('country')}} = 'France'",
    category: 'misc',
  },
];

/**
 * Returns an array with the calc operations keys.
 *
 * @returns List of calc keys
 */
export const getCalcKeys = (): string[] =>
  CALC_FUNCTIONS_META.map(
    (fn) => CALC_PREFIX + fn.signature + PLACEHOLDER_SUFFIX
  );

/** Info placeholders supported in calculated-field expressions. */
export const INFO_KEYS = ['createdAt', 'updatedAt', 'incrementalId'];

/**
 * Returns an array with the info data keys.
 *
 * @returns List of info keys
 */
export const getInfoKeys = (): string[] =>
  INFO_KEYS.map((k) => INFO_PREFIX + k + PLACEHOLDER_SUFFIX);

/**
 * Returns an array with the keys for data autocompletion.
 *
 * @param fields Array of fields.
 * @returns list of data keys
 */
export const getDataKeys = (fields: any): string[] =>
  fields.map((field: any) => DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX);

/**
 * Returns an array with the keys for user contextual field autocompletion.
 *
 * @param attributes Array of configured user attributes.
 * @returns list of user keys
 */
export const getUserKeys = (attributes: UserAttribute[] = []): string[] =>
  attributes.map((attribute) => {
    const value = typeof attribute === 'string' ? attribute : attribute.value;
    return USER_PREFIX + value + PLACEHOLDER_SUFFIX;
  });
