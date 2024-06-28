import { get } from 'lodash';
import { GlobalOptions } from '../types';
import { SurveyModel } from 'survey-core';
import { getPanelDynamicData } from './getPanelDynamicData';

/**
 * Joins the members of a array or the all the values of a panel dynamic question, using the string separator.
 *
 * @param this Self
 * @param this.survey Survey instance
 * @param params The arg and the separator to use. Arg can be a array or a question name (question parent must be a panel dynamic)
 * @returns the string from the join operation
 */
function join(this: { survey: SurveyModel }, params: any[]) {
  const [separator, arg] = params;
  if (Array.isArray(arg)) {
    return arg.join(separator);
  } else {
    // If param is not a array: is a question name, question is from a dynamic panel and we should use all the answer to each panel question
    const surveyData = this.survey.data;
    const question = this.survey.getQuestionByName(arg);

    const isInPanel = question.parentQuestion?.getType() === 'paneldynamic';
    if (isInPanel) {
      const parentPanelData = getPanelDynamicData(
        surveyData,
        question.parentQuestion.name
      );
      const values = parentPanelData.flatMap((panel: any) =>
        panel.flatMap((values: any) => get(values, arg))
      );
      return values.join(separator);
    }
  }
  return '';
}

/**
 *  Generator for the custom function join.
 *
 * @param _ Global options
 * @returns The custom function join
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => join;
