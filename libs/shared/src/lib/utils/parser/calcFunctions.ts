import { formatDate } from '@angular/common';
import { ceil, floor, round } from 'lodash';

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
      checkNumberArguments(parsedValue, parsedPrecision);
      return round(parsedValue, parsedPrecision).toString();
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
      checkNumberArguments(parsedValue, parsedPrecision);
      return ceil(parsedValue, parsedPrecision).toString();
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
      checkNumberArguments(parsedValue, parsedPrecision);
      return floor(parsedValue, parsedPrecision).toString();
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
      checkNumberArguments(percent, parsedPrecision);
      return percent.toFixed(parsedPrecision) + '%';
    },
  },
  formatDate: {
    signature: 'formatDate( value ; format)',
    /**
     * Format a date
     *
     * @param value The date to format
     * @param format The format to use (optional, default to 'mediumDate')
     * @param locale The locale to use (optional, default to the user browser locale)
     * @param timezone The timezone to use (optional, default to the user browser timezone)
     * @returns The formatted date
     */
    call: (
      value,
      format = 'mediumDate',
      locale = Intl.DateTimeFormat().resolvedOptions().locale, // could also be navigator.language
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    ) => {
      return formatDate(value, format, locale, timezone);
    },
  },
};

export default calcFunctions;
