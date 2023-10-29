import { SurveyModel } from 'survey-core';
import { GlobalOptions } from '../types';

/**
 * Registration of new custom functions for the survey.
 *
 * @param this Survey instance
 * @param this.survey Survey instance
 * @param params params passed to the function
 * @returns The list of the values of the given property for the dynamic panel
 */
function getListByProp(this: { survey: SurveyModel }, params: any[]) {
  // get question name from params
  const [arrayOfObjects, propName] = params;
  if (!Array.isArray(arrayOfObjects) || !propName) {
    return [];
  }

  return arrayOfObjects.map((obj) => obj[propName]);
}

/**
 *  Generator for the custom function getListByProp.
 *
 * @param _ Global options
 * @returns The custom function getListByProp
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getListByProp;
