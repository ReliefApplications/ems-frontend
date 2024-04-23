import { GlobalOptions } from '../types';

/**
 * Rounds a value to the nearest integer.
 *
 * @param params the value to round
 * @returns the rounded value
 */
const round = (params: any[]) => {
  const [value, decimalPlacesInput] = params;
  const decimalPlaces = decimalPlacesInput || 0;

  if (typeof value !== 'number') {
    return null;
  }

  return Math.round(value * 10 ** decimalPlaces) / 10 ** decimalPlaces;
};

/**
 *  Generator for the custom function round.
 *
 * @param _ Global options
 * @returns The custom function round
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => round;
