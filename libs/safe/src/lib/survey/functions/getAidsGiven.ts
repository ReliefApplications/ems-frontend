import { SurveyModel } from 'survey-angular';

/**
 * Registration of new custom functions for the survey.
 *
 * @param this Survey instance
 * @param this.survey Survey instance
 * @param params params passed to the function
 * @returns The total number of aids
 */
export default function (this: { survey: SurveyModel }, params: any[]) {
  // get question name from params
  const [questionName] = params;
  // get question from survey
  const question = this.survey.getQuestionByName(questionName);
  const aids = question?.value;
  console.log(aids, question);
  if (!Array.isArray(aids)) {
    return null;
  }

  return aids.reduce(
    (total, aid) =>
      total + (aid && aid.type && aid.registered_at && aid.items_given ? 1 : 0),
    0
  );
}
