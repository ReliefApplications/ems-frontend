import { SurveyModel } from 'survey-core';
import { GlobalOptions } from '../types';

/**
 * Gets today in UTC
 *
 * @returns UTC Date
 */
const todayDate = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(Date.UTC(year, month, day));
};

/**
 * Returns an array with info pertaining to each prescription of a family.
 *
 * @param this Self
 * @param this.survey Survey instance
 * @param params Prescriptions array
 * @returns Calculated information for each prescription
 */
function getPrescriptionInfo(this: { survey: SurveyModel }, params: any[]) {
  const [prescription] = params;

  const DEFAULT_INFO = {
    is_active: false,
    header_text: 'Remplir la prescription',
  };

  if (typeof prescription !== 'object' || !prescription) {
    return DEFAULT_INFO;
  }

  const { start, end, aid_frequency: aidFrequency, aids } = prescription;

  // If the data is not fully filled
  if (!start || !end || !aidFrequency) {
    return DEFAULT_INFO;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  // calculate the difference in months
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();

  // result is the number of months between the two dates times the frequency
  const maxAids = startDate > endDate ? 0 : (months || 1) * aidFrequency;
  const endDatePassed = endDate < todayDate();
  const isActive =
    startDate < endDate && !endDatePassed && !((aids || []).length >= maxAids);

  return {
    is_active: isActive,
    header_text: isActive
      ? 'Prescription en cours de validité'
      : endDatePassed
      ? 'Prescription expirée'
      : 'Prescription déjà utilisée',
  };
}

/**
 *  Generator for the custom function getTotalAids.
 *
 * @param _ Global options
 * @returns The custom function getTotalAids
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getPrescriptionInfo;
