import { asyncFunctions, functions } from './functions';
import { GlobalOptions } from './types';

/**
 * Registration of new custom functions for the survey.
 * Custom functions can be used in the logic fields.
 *
 * @param survey Survey instance
 * @param options Global options, that can be used in any custom function
 */
const addCustomFunctions = (survey: any, options: GlobalOptions): void => {
  // Register custom functions from the functions folder
  [...functions, ...asyncFunctions]
    .map(({ fn, name }) => ({
      fn: fn(options),
      name,
    }))
    .forEach((fn, i) => {
      const isAsync = i >= functions.length;
      survey.FunctionFactory.Instance.register(fn.name, fn.fn, isAsync);
    });
};

export default addCustomFunctions;
