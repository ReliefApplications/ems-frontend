/** Prefix for data keys */
const DATA_PREFIX = '{{data.';
/** Prefix for calc keys */
const CALC_PREFIX = '{{calc.';
/** Prefix for info keys */
const INFO_PREFIX = '{{info.';
/** Suffix for all keys */
const PLACEHOLDER_SUFFIX = '}}';

type ResourceField = {
  name: string;
  isCalculated?: boolean;
  resource?: {
    fields?: ResourceField[];
  };
};

type RelatedForm = {
  fields?: Array<{
    name: string;
    resource?: string;
    relatedName?: string;
  }>;
  resource?: {
    id?: string;
    fields?: ResourceField[];
  };
};

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
export const getDataKeys = (fields: ResourceField[]): string[] =>
  fields.flatMap((field) => [
    DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX,
    `${DATA_PREFIX}${field.name}:text${PLACEHOLDER_SUFFIX}`,
  ]);

/**
 * Returns related-resource selector keys for data autocompletion.
 *
 * @param relatedForms Forms that point back to the current resource
 * @param currentResourceId Current resource id
 * @returns list of related data keys
 */
export const getRelatedDataKeys = (
  relatedForms: RelatedForm[] = [],
  currentResourceId: string
): string[] => {
  const relatedKeys = new Set<string>();

  relatedForms.forEach((form) => {
    form.fields?.forEach((field) => {
      if (field.relatedName && field.resource === currentResourceId) {
        const childFields = (form.resource?.fields || []).filter(
          (childField) => !childField.isCalculated
        );
        childFields.forEach((childField) => {
          relatedKeys.add(
            `${DATA_PREFIX}${field.relatedName}(first: 1, sortField: "${childField.name}", sortOrder: "desc").${childField.name}${PLACEHOLDER_SUFFIX}`
          );
        });
      }
    });
  });

  return Array.from(relatedKeys).sort();
};
