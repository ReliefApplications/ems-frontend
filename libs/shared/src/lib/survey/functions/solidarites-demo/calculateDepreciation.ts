import { GlobalOptions } from '../../types';
import { DEPRECATION_DATA } from './assets/deprecation-data';

/**
 * Calculate the depreciation of an item given its family
 *
 * @param params The item's initial value, family and invoice date
 * @returns the remaining value of the item
 */
const calculateDepreciation = (params: any[]) => {
  const initialValue = params[0];
  const family = params[1];
  const invoiceDate = params[2];

  const item = DEPRECATION_DATA.find((item) => item.family === family);
  if (!item) return null;
  const depreciation = item.depreciation;
  const depreciationPeriod = item.depreciation_period;
  const depreciationPerMonth = depreciation / depreciationPeriod;
  const monthsSincePurchase = Math.floor(
    (new Date().getTime() - new Date(invoiceDate).getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );
  const depreciationAmount = monthsSincePurchase * depreciationPerMonth;
  return initialValue - depreciationAmount;
};

/**
 *  Generator for the custom function calculateDepreciation.
 *
 * @param _ Global options
 * @returns The custom function calculateDepreciation
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => calculateDepreciation;
