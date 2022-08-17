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
    call: (value, precision = '0') => {
      const parsedValue = parseFloat(value);
      const parsedPrecision = parseInt(precision, 10);
      if (isNaN(parsedValue) || isNaN(parsedPrecision))
        throw new Error('One of the arguments is not a number');
      return parsedValue.toFixed(parsedPrecision);
    },
  },
  percentage: {
    signature: 'percentage( value ; total ; precision )',
    call: (value, total = '1', precision = '2') => {
      const percent = (parseFloat(value) / parseFloat(total)) * 100;
      const parsedPrecision = parseInt(precision, 10);
      if (isNaN(percent) || isNaN(parsedPrecision))
        throw new Error('One of the arguments is not a number');
      return percent.toFixed(parsedPrecision) + '%';
    },
  },
};

export default calcFunctions;
