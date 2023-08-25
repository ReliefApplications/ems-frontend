import { flatten } from 'lodash';
import { SurveyModel } from 'survey-angular';

/**
 * Registration of new custom functions for the survey.
 *
 * @param this Survey instance
 * @param this.survey Survey instance
 * @param params params passed to the function
 * @returns The total number of aids
 */
function summarizeAids(this: { survey: SurveyModel }, params: any[]) {
  // get question name from params
  const [questionName] = params;
  // get question from survey
  const question = this.survey.getQuestionByName(questionName);
  return flatten(
    question?.value
      ?.map((prescription: any) => prescription.aids)
      ?.filter((aid: string) => !!aid) ?? []
  );
}

export default summarizeAids;
