import { GlobalOptions } from '../../types';
import { DEPRECATION_DATA } from './assets/deprecation-data';

/**
 * Gets the depreciation period of an item given its family
 *
 * @param params The item's family
 * @returns the depreciation period of the item
 */
const getDepreciationPeriod = (params: any[]) => {
  const family = params[0];
  const item = DEPRECATION_DATA.find((item) => item.family === family);

  if (!item) return null;

  return item.depreciation_period;
};

/**
 *  Generator for the custom function getDepreciationPeriod.
 *
 * @param _ Global options
 * @returns The custom function getDepreciationPeriod
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getDepreciationPeriod;
