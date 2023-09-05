import { SurveyModel } from 'survey-angular';
import { GlobalOptions } from '../types';

/**
 * Registration of new custom functions for the survey.
 *
 * @param this Self
 * @param this.survey Survey instance
 * @param params Params passed to the function
 * @returns The total number of aids
 */
function getTotalAids(this: { survey: SurveyModel }, params: any[]) {
  const [startDate, endDate, aidFrequency] = params;
  if (!startDate || !endDate || !aidFrequency) {
    return null;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);

  // calculate the difference in months
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();

  // result is the number of months between the two dates times the frequency
  return months * aidFrequency;
}

/**
 *  Generator for the custom function getTotalAids.
 *
 * @param _ Global options
 * @returns The custom function getTotalAids
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getTotalAids;
