/**
 * Definition of all supported functions for calculations inside a text of a
 * summary card
 */
const calcFunctions: Record<
  string,
  { signature: string; call: (...args: string[]) => string }
> = {
  round: {
    signature: '@calc.round( value ; precision )',
    call: (value, precision = '0') => {
      try {
        const parsedValue = parseFloat(value);
        const parsedPrecision = parseInt(precision, 10);
        if (isNaN(parsedValue) || isNaN(parsedPrecision))
          throw new Error('Not a number');
        return parsedValue.toFixed(parsedPrecision);
      } catch (err) {
        return `[@calc.round ${err}]`;
      }
    },
  },
  percentage: {
    signature: '@calc.percentage( value ; total ; precision )',
    call: (value, total = '1', precision = '2') => {
      try {
        const percent = (parseFloat(value) / parseFloat(total)) * 100;
        const parsedPrecision = parseInt(precision, 10);
        if (isNaN(percent) || isNaN(parsedPrecision))
          throw new Error('Not a number');
        return percent.toFixed(parsedPrecision) + '%';
      } catch (err) {
        return `[@calc.percentage ${err}]`;
      }
    },
  },
};

export default calcFunctions;
