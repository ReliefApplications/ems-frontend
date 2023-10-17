/** Prefix for data keys */
const DATA_PREFIX = '{{data.';
/** Prefix for calc keys */
const CALC_PREFIX = '{{calc.';
/** Prefix for info keys */
const INFO_PREFIX = '{{info.';
/** Suffix for all keys */
const PLACEHOLDER_SUFFIX = '}}';

/** Definition of all supported functions for calculation of Calculated fields */
const calcFunctions: Record<string, { signature: string }> = {
  // MULTIPLE ARGUMENTS
  add: {
    signature: 'add( value1 ; value2 ; ... )',
  },
  mul: {
    signature: 'mul( value1 ; value2 ; ... )',
  },
  and: {
    signature: 'and( value1 ; value2 ; ... )',
  },
  or: {
    signature: 'or( value1 ; value2 ; ... )',
  },
  concat: {
    signature: 'concat( value1 ; value2 ; ... )',
  },
  if: {
    signature: 'if( condition ; then ; else )',
  },
  substr: {
    signature: 'substr( value ; startIndex ; length )',
  },

  // DOUBLE ARGUMENTS
  sub: {
    signature: 'sub( value1 ; value2 )',
  },
  div: {
    signature: 'div( value1 ; value2 )',
  },
  gte: {
    signature: 'gte( value1 ; value2 )',
  },
  gt: {
    signature: 'gt( value1 ; value2 )',
  },
  lte: {
    signature: 'lte( value1 ; value2 )',
  },
  lt: {
    signature: 'lt( value1 ; value2 )',
  },
  eq: {
    signature: 'eq( value1 ; value2 )',
  },
  ne: {
    signature: 'ne( value1 ; value2 )',
  },
  datediff: {
    signature: 'datediff( date1 ; date2 )',
  },

  // SINGLE ARGUMENTS
  year: {
    signature: 'year( date )',
  },
  month: {
    signature: 'month( date )',
  },
  day: {
    signature: 'day( date )',
  },
  hour: {
    signature: 'hour( date )',
  },
  minute: {
    signature: 'minute( date )',
  },
  second: {
    signature: 'second( date )',
  },
  millisecond: {
    signature: 'millisecond( date )',
  },
  date: {
    signature: 'date( value )',
  },
  exists: {
    signature: 'exists( value )',
  },
  size: {
    signature: 'size( value )',
  },
  toInt: {
    signature: 'toInt( value )',
  },
  length: {
    signature: 'length( value )',
  },
  toLong: {
    signature: 'toLong( value )',
  },
  includes: {
    signature: 'includes( array ; element )',
  },

  // ONE OR NO ARGUMENTS
  today: {
    signature: 'today( offset )',
  },
};

/**
 * Returns an array with the calc operations keys.
 *
 * @returns List of calc keys
 */
export const getCalcKeys = (): string[] => {
  const calcObjects = Object.values(calcFunctions);
  return calcObjects.map(
    (obj) => CALC_PREFIX + obj.signature + PLACEHOLDER_SUFFIX
  );
};

/**
 * Returns an array with the info data keys.
 *
 * @returns List of info keys
 */
export const getInfoKeys = (): string[] =>
  ['createdAt', 'updatedAt', 'incrementalId'].map(
    (k) => INFO_PREFIX + k + PLACEHOLDER_SUFFIX
  );

/**
 * Returns an array with the keys for data autocompletion.
 *
 * @param fields Array of fields.
 * @returns list of data keys
 */
export const getDataKeys = (fields: any): string[] =>
  fields.map((field: any) => DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX);
