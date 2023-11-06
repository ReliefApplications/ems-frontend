import { SurveyModel } from 'survey-core';
import { GlobalOptions } from '../types';

/**
 * Registration of new custom functions for the survey.
 *
 * @param this Survey instance
 * @param this.survey Survey instance
 * @param params params passed to the function
 * @returns The total number of aids
 */
function getAidsGiven(this: { survey: SurveyModel }, params: any[]) {
  // get question name from params
  const [questionName] = params;
  // get question from survey
  const question = this.survey.getQuestionByName(questionName);
  const aids = question?.value;
  if (!Array.isArray(aids)) {
    return null;
  }

  return aids.reduce(
    (total, aid) =>
      total + (aid && aid.type && aid.registered_at && aid.items_given ? 1 : 0),
    0
  );
}

/**
 *  Generator for the custom function getAidsGiven.
 *
 * @param _ Global options
 * @returns The custom function getAidsGiven
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getAidsGiven;
