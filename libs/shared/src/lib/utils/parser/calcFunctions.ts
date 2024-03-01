import { ceil, floor, max, min, round } from 'lodash';

/**
 * Check that all arguments are number
 * Throw an error if not
 *
 * @param {...any} args calc function arguments
 */
const checkNumberArguments = (...args: any): void => {
  for (const arg of args) {
    if (isNaN(arg)) {
      const err = new Error('One of the arguments is not a number');
      err.name = 'NaN';
      throw err;
    }
  }
  return;
};

/**
 * Definition of all supported functions for calculations inside the text of a
 * summary card
 */
const calcFunctions: Record<
  string,
  { signature: string; call: (...args: string[]) => string }
> = {
  round: {
    signature: 'round( value ; precision )',
    /**
     * Calculate the rounded value of a given value
     *
     * @param value The decimal value to round
     * @param precision The precision we want, in number of decimals (optional, default to 0)
     * @returns The rounded value
     */
    call: (value, precision = '0') => {
      const parsedValue = parseFloat(value);
      const parsedPrecision = parseInt(precision, 10);
      try {
        checkNumberArguments(parsedValue, parsedPrecision);
        return round(parsedValue, parsedPrecision).toString();
      } catch {
        return '0';
      }
    },
  },
  roundup: {
    signature: 'roundup( value ; precision )',
    /**
     * Calculate the rounded value of a given value
     *
     * @param value The decimal value to round
     * @param precision The precision we want, in number of decimals (optional, default to 0)
     * @returns The rounded value
     */
    call: (value, precision = '0') => {
      const parsedValue = parseFloat(value);
      const parsedPrecision = parseInt(precision, 10);
      try {
        checkNumberArguments(parsedValue, parsedPrecision);
        return ceil(parsedValue, parsedPrecision).toString();
      } catch {
        return '0';
      }
    },
  },
  rounddown: {
    signature: 'rounddown( value ; precision )',
    /**
     * Calculate the rounded value of a given value
     *
     * @param value The decimal value to round
     * @param precision The precision we want, in number of decimals (optional, default to 0)
     * @returns The rounded value
     */
    call: (value, precision = '0') => {
      const parsedValue = parseFloat(value);
      const parsedPrecision = parseInt(precision, 10);
      try {
        checkNumberArguments(parsedValue, parsedPrecision);
        return floor(parsedValue, parsedPrecision).toString();
      } catch {
        return '0';
      }
    },
  },
  percentage: {
    signature: 'percentage( value ; total ; precision )',
    /**
     * Transform a value as a percentage
     *
     * @param value The value to transform
     * @param total The total reference of the percentage (optional, default to 1)
     * @param precision The precision we want, in number of decimals (optional, default to 2)
     * @returns The value as a percentage
     */
    call: (value, total = '1', precision = '2') => {
      const percent = (parseFloat(value) / parseFloat(total)) * 100;
      const parsedPrecision = parseInt(precision, 10);
      try {
        checkNumberArguments(percent, parsedPrecision);
        return percent.toFixed(parsedPrecision) + '%';
      } catch {
        return '0';
      }
    },
  },
  min: {
    signature: 'min( value1 ; value2 ; ... )',
    /**
     * Get minimum value from array
     *
     * @param values array of values, must be separated in the template by ";"
     * @returns minimum value
     */
    call: (...values) => {
      return min(values)?.toString() || '';
    },
  },
  max: {
    signature: 'max( value1 ; value2 ; ... )',
    /**
     * Get maximum value from array
     *
     * @param values array of values, must be separated in the template by ";"
     * @returns maximum value
     */
    call: (...values) => {
      return max(values)?.toString() || '';
    },
  },
};

export default calcFunctions;
