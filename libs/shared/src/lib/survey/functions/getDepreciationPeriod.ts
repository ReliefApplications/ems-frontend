import { GlobalOptions } from '../types';

const depreciationData = [
  {
    family: 'mobile',
    depreciation_period: 12, // in months
    depreciation: 50, // in euros
  },
  {
    family: 'vehicle',
    depreciation_period: 24, // in months
    depreciation: 150, // in euros
  },
  {
    family: 'surgical',
    depreciation_period: 6, // in months
    depreciation: 10, // in euros
  },
  {
    family: 'measuring',
    depreciation_period: 36, // in months
    depreciation: 10, // in euros
  },
  {
    family: 'computing',
    depreciation_period: 12, // in months
    depreciation: 75, // in euros
  },
];

/**
 * Gets the depreciation period of an item given its family
 *
 * @param params The item's family
 * @returns the depreciation period of the item
 */
const getDepreciationPeriod = (params: any[]) => {
  const family = params[0];
  const item = depreciationData.find((item) => item.family === family);

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
